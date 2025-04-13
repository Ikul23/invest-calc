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

        $taxRate = 0.25; // 25% налог
        $discountRate = 0.1; // 10% дисконт

        $cashFlows = [];
        $cashflowDetails = [];

        foreach ($data['financial_data'] as $yearData) {
            $year = $yearData['year'];
            $revenue = $yearData['revenue'];
            $opex = $yearData['opex'];
            $capex = $yearData['capex'];

            // Прибыль до налога
            $ebt = $revenue - $opex - $capex;

            // Налог, если прибыль положительная
            $tax = $ebt > 0 ? $ebt * $taxRate : 0;

            // Чистый денежный поток
            $netCashFlow = $ebt - $tax;
            $cashFlows[] = $netCashFlow;

            $cashflowDetails[] = [
                'year' => $year,
                'revenue' => $revenue,
                'opex' => $opex,
                'capex' => $capex,
                'ebt' => round($ebt, 2),
                'tax' => round($tax, 2),
                'cashflow' => round($netCashFlow, 2),
            ];
        }

        // Сохраняем данные в базу
        foreach ($data['financial_data'] as $yearData) {
            InputData::create([
                'project_name' => $data['project_name'],
                'year' => $yearData['year'],
                'revenue' => $yearData['revenue'],
                'opex' => $yearData['opex'],
                'capex' => $yearData['capex'],
            ]);
        }

        // Метрики
        $npv = round($this->calculateNPV($cashFlows, $discountRate), 2);
        $irr = round($this->calculateIRR($cashFlows) * 100, 2);
        $dpbp = $this->calculateDPBP($cashFlows, $discountRate);

        return response()->json([
            'project_name' => $data['project_name'],
            'cashflow' => $cashflowDetails,
            'metrics' => [
                'npv' => $npv,
                'irr' => $irr,
                'dpbp' => $dpbp,
                'discountRate' => $discountRate * 100,
                'taxRate' => $taxRate * 100,
            ]
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
