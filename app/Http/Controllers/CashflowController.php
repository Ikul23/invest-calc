<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InputData;
use Barryvdh\DomPDF\Facade\Pdf;

class CashflowController extends Controller
{
    public function calculate(Request $request)
    {
        $data = $request->validate([
            'project_name' => 'required|string',
            'financial_data' => 'required|array',
        ]);

        // Извлекаем данные по годам
        $revenue = array_column($data['financial_data'], 'revenue');
        $opex = array_column($data['financial_data'], 'opex');
        $capex = array_column($data['financial_data'], 'capex');

        // ... (остальная логика расчётов)

        // Сохраняем в БД
        foreach ($data['financial_data'] as $yearData) {
            InputData::create([
                'project_name' => $data['project_name'],
                ...$yearData,
            ]);
        }

        return response()->json([
            'project_name' => $data['project_name'],
            'cashFlows' => $cashFlows,
            'npv' => round($npv, 2),
            'irr' => round($irr * 100, 2),
            'dpbp' => $dpbp,
        ]);
    }

    private function calculateIRR(array $cashFlows): float
    {
        $precision = 0.00001;
        $maxIterations = 100;
        $irr = 0.1; // Начальное предположение

        for ($i = 0; $i < $maxIterations; $i++) {
            $npv = 0;
            $derivative = 0;

            foreach ($cashFlows as $t => $cf) {
                $npv += $cf / pow(1 + $irr, $t + 1);
                $derivative -= ($t + 1) * $cf / pow(1 + $irr, $t + 2);
            }

            if (abs($npv) < $precision) break;
            $irr -= $npv / $derivative;
        }

        return $irr;
    }

    private function calculateDPBP(array $cashFlows, $discountRate): int
    {
        $cumulativeNpv = 0;
        foreach ($cashFlows as $year => $cf) {
            $discountedCf = $cf / pow(1 + $discountRate, $year + 1);
            $cumulativeNpv += $discountedCf;
            if ($cumulativeNpv >= 0) {
                return $year + 1;
            }
        }
        return -1;
    }

    private function calculateNPV(array $cashFlows, float $discountRate): float
    {
        $npv = 0;
        foreach ($cashFlows as $t => $cf) {
            $npv += $cf / pow(1 + $discountRate, $t + 1);
        }
        return $npv;
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
}
