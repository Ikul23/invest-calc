<?php

namespace App\Http\Controllers;

use App\Models\InputData;
use App\Models\Project;
use App\Models\ProjectMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CashflowController extends Controller
{
    public function calculate(Request $request)
    {
        $data = $request->validate([
            'project_name' => 'required|string',
            'discount_rate' => 'required|numeric',
            'tax_rate' => 'required|numeric',
            'financial_data' => 'required|array',
            'financial_data.*.year' => 'required|integer',
            'financial_data.*.revenue' => 'required|numeric',
            'financial_data.*.opex' => 'required|numeric',
            'financial_data.*.capex' => 'required|numeric',
        ]);

        // Создаем проект
        $project = Project::create([
            'name' => $data['project_name'],
            'slug' => Str::slug($data['project_name']) . '-' . time(),
        ]);

        $projectId = $project->id;

        // Сохраняем финансовые данные
        foreach ($data['financial_data'] as $yearData) {
            InputData::create([
                'project_id' => $projectId,
                'project_name' => $data['project_name'],
                'year' => $yearData['year'],
                'revenue' => $yearData['revenue'],
                'opex' => $yearData['opex'],
                'capex' => $yearData['capex'],
            ]);
        }

        // Расчёты
        $cashflows = [];
        $initialInvestment = 0;

        foreach ($data['financial_data'] as $yearData) {
            $year = $yearData['year'];
            $revenue = $yearData['revenue'];
            $opex = $yearData['opex'];
            $capex = $yearData['capex'];

            $taxableIncome = $revenue - $opex;
            $tax = $taxableIncome * ($data['tax_rate'] / 100);
            $cashflow = ($revenue - $opex - $tax) - $capex;

            $cashflows[] = $cashflow;

            if ($year === $data['financial_data'][0]['year']) {
                $initialInvestment = $capex;
            }
        }

        // NPV
        $npv = 0;
        foreach ($cashflows as $i => $cf) {
            $npv += $cf / pow(1 + ($data['discount_rate'] / 100), $i + 1);
        }

        // IRR (грубый перебор)
        $irrGuess = 0.01;
        $maxIterations = 1000;
        $tolerance = 0.0001;
        for ($i = 0; $i < $maxIterations; $i++) {
            $npvGuess = 0;
            foreach ($cashflows as $j => $cf) {
                $npvGuess += $cf / pow(1 + $irrGuess, $j + 1);
            }

            if (abs($npvGuess) < $tolerance) {
                break;
            }

            $irrGuess += 0.0005;
        }
        $irr = round($irrGuess * 100, 2);

        // DPBP (Discounted Payback Period)
        $discountRate = $data['discount_rate'] / 100;
        $cumulative = 0;
        $dpbp = 0;
        foreach ($cashflows as $i => $cf) {
            $discounted = $cf / pow(1 + $discountRate, $i + 1);
            $cumulative += $discounted;
            if ($cumulative < 0) {
                $dpbp++;
            } else {
                $dpbp += (abs($cumulative - $discounted) / $discounted);
                break;
            }
        }

        // Сохраняем метрики
        ProjectMetric::create([
            'project_id' => $projectId,
            'npv' => round($npv, 2),
            'irr' => $irr,
            'dpbp' => round($dpbp, 2),
            'discount_rate' => $data['discount_rate'],
            'tax_rate' => $data['tax_rate'],
        ]);

        return response()->json([
            'message' => 'Расчет выполнен и данные сохранены',
            'project_id' => $projectId,
            'npv' => round($npv, 2),
            'irr' => $irr,
            'dpbp' => round($dpbp, 2),
        ]);
    }


    public function exportPdf(Request $request)
    {
        $data = $request->validate([
            'project_name' => 'required|string',
            'cashFlows' => 'required|array',
            'npv' => 'required|numeric',
            'irr' => 'required|numeric',
            'dpbp' => 'required|numeric',
        ]);

        $pdf = Pdf::loadView('pdf.report', $data);
        return $pdf->download($data['project_name'] . '_report.pdf');
    }
    public function getResults($projectId)
    {
        $inputData = InputData::where('project_id', $projectId)
            ->orderBy('year')
            ->get();

        if ($inputData->isEmpty()) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $projectName = $inputData->first()->project_name;
        $metrics = ProjectMetric::where('project_id', $projectId)->first();

        $cashflowDetails = $inputData->map(function ($row) {
            return [
                'year' => $row->year,
                'revenue' => $row->revenue,
                'opex' => $row->opex,
                'capex' => $row->capex,
                'ebt' => $row->revenue - $row->opex - $row->capex,
                'tax' => max(0, ($row->revenue - $row->opex - $row->capex) * 0.25),
                'cashflow' => ($row->revenue - $row->opex - $row->capex) * 0.75
            ];
        });

        return response()->json([
            'project_id' => $projectId,
            'project_name' => $projectName,
            'cashflows' => $cashflowDetails,
            'project_metric' => $metrics ?: null
        ]);
    }
}
