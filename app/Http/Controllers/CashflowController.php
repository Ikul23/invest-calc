<?php

namespace App\Http\Controllers;

use App\Models\InputData;
use App\Models\Project;
use App\Models\ProjectMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CashflowController extends Controller
{
    const DISCOUNT_RATE = 35; // Добавленная глобальная константа
    const DEPRECIATION_PERIOD = 7;
    const TAX_RATE = 0.25;
    const RECEIVABLES_TURNOVER = 0.35;
    const PAYABLES_TURNOVER = 0.32;

    public function calculate(Request $request)
    {
        try {
            $data = $request->validate([
                'project_name' => 'required|string',
                'financial_data' => 'required|array',
                'financial_data.*.year' => 'required|integer|min:2000|max:2100',
                'financial_data.*.revenue' => 'required|numeric|min:0',
                'financial_data.*.opex' => 'required|numeric|min:0',
                'financial_data.*.capex' => 'required|numeric|min:0',
            ]);
            $data['discount_rate'] = self::DISCOUNT_RATE;

            // Расчеты с использованием константы
            $discountRateDecimal = self::DISCOUNT_RATE / 100;

            DB::beginTransaction();

            $project = Project::create([
                'name' => $data['project_name'],
                'slug' => Str::slug($data['project_name']) . '-' . time(),
            ]);

            $projectId = $project->id;
            $depreciationSchedule = $this->calculateDepreciation($data['financial_data']);
            $initialInvestment = $data['financial_data'][0]['capex'] ?? 0;

            $cashflowDetails = [];
            $cashflows = [];
            $npvData = [];
            $cumulativeCashflow = 0;
            $cumulativeDiscounted = 0;
            $simplePaybackPeriod = null;

            foreach ($data['financial_data'] as $index => $yearData) {
                $year = $yearData['year'];
                $revenue = $yearData['revenue'];
                $opex = $yearData['opex'];
                $capex = $yearData['capex'];
                $depreciation = $depreciationSchedule[$year] ?? 0;

                $ebitda = $revenue - $opex;
                $ebit = $ebitda - $depreciation;
                $tax = max(0, $ebit * self::TAX_RATE);
                $netIncome = $ebit - $tax;

                $receivables = $revenue * self::RECEIVABLES_TURNOVER;
                $payables = $opex * self::PAYABLES_TURNOVER;
                $workingCapital = $receivables - $payables;

                $cashflow = $netIncome + $depreciation - $workingCapital - $capex;
                $cumulativeCashflow += $cashflow;

                $discountedCashflow = $cashflow / pow(1 + $discountRateDecimal, $index + 1);
                $cumulativeDiscounted += $discountedCashflow;
                $npvData[] = $cumulativeDiscounted;

                if ($simplePaybackPeriod === null && $cumulativeCashflow >= 0) {
                    $simplePaybackPeriod = $index + ($cumulativeCashflow - $cashflow) / max($cashflow, 0.0001);
                }

                $cashflowDetails[] = [
                    'year' => $year,
                    'revenue' => $revenue,
                    'opex' => $opex,
                    'capex' => $capex,
                    'depreciation' => $depreciation,
                    'ebitda' => $ebitda,
                    'ebit' => $ebit,
                    'tax' => $tax,
                    'net_income' => $netIncome,
                    'working_capital' => $workingCapital,
                    'cashflow' => $cashflow,
                    'npv' => $cumulativeDiscounted
                ];

                $cashflows[] = $cashflow;
            }

            $irr = $this->calculateIRR($cashflows);
            $dpbp = $this->calculateDPBP($cashflows, $data['discount_rate']);

            ProjectMetric::create([
                'project_id' => $projectId,
                'npv' => round($cumulativeDiscounted, 2),
                'irr' => round($irr, 2),
                'dpbp' => round($dpbp, 2),
                'pp' => round($simplePaybackPeriod ?? count($cashflows), 2),
                'discount_rate' => $data['discount_rate'],
                'depreciation_total' => array_sum(array_column($cashflowDetails, 'depreciation')),
                'ebit_total' => array_sum(array_column($cashflowDetails, 'ebit')),
                'net_income_total' => array_sum(array_column($cashflowDetails, 'net_income')),
                'working_capital_total' => array_sum(array_column($cashflowDetails, 'working_capital')),
                'initial_investment' => $initialInvestment,
                'cumulative_cashflow' => $cumulativeCashflow
            ]);

            foreach ($cashflowDetails as $detail) {
                InputData::create(array_merge(
                    ['project_id' => $projectId, 'project_name' => $data['project_name']],
                    $detail
                ));
            }

            DB::commit();

            return response()->json([
                'message' => 'Расчет успешно завершен',
                'projectData' => [
                    'project_id' => $projectId,
                    'project_name' => $project->name,
                    'cashflow' => $cashflowDetails,
                    'metrics' => [
                        'npv' => round($cumulativeDiscounted, 2),
                        'irr' => round($irr, 2),
                        'dpbp' => round($dpbp, 2),
                        'pp' => round($simplePaybackPeriod ?? count($cashflows), 2),
                        'discount_rate' => self::DISCOUNT_RATE,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    private function calculateIRR(array $cashflows, float $initialGuess = 0.1, int $maxIterations = 100, float $tolerance = 1e-6): float
    {
        $rate = $initialGuess;

        for ($i = 0; $i < $maxIterations; $i++) {
            $npv = 0;
            $derivative = 0;

            foreach ($cashflows as $t => $cashflow) {
                $npv += $cashflow / pow(1 + $rate, $t + 1);
                $derivative -= ($t + 1) * $cashflow / pow(1 + $rate, $t + 2);
            }

            if (abs($derivative) < 1e-10) {
                break;
            }

            $newRate = $rate - $npv / $derivative;

            if ($newRate < -1) $newRate = -0.99;
            if ($newRate > 10) $newRate = 10;

            if (abs($newRate - $rate) < $tolerance) {
                return $newRate * 100;
            }

            $rate = $newRate;
        }

        return $rate * 100;
    }

    private function calculateDPBP(array $cashflows, float $discountRate): float
    {
        $discountRateDecimal = $discountRate / 100;
        $cumulative = 0;

        foreach ($cashflows as $t => $cashflow) {
            $discounted = $cashflow / pow(1 + $discountRateDecimal, $t + 1);
            $cumulative += $discounted;

            if ($cumulative >= 0) {
                return $t + ($cumulative - $discounted) / max($discounted, 0.0001);
            }
        }

        return count($cashflows);
    }

    private function calculateDepreciation(array $financialData): array
    {
        $schedule = [];
        $period = self::DEPRECIATION_PERIOD;

        foreach ($financialData as $data) {
            $year = $data['year'];
            $capex = $data['capex'];

            for ($i = 0; $i < $period; $i++) {
                $depYear = $year + $i;
                $annualDep = $capex / $period;

                if (!isset($schedule[$depYear])) {
                    $schedule[$depYear] = 0;
                }

                $schedule[$depYear] += $annualDep;
            }
        }

        return $schedule;
    }

    public function getResults($projectId)
    {
        $project = Project::find($projectId);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $cashflow = InputData::where('project_id', $projectId)->get() ?: [];
        $metrics = ProjectMetric::where('project_id', $projectId)->first();

        return response()->json([
            'projectData' => [
                'project_id' => $project->id,
                'project_name' => $project->name,
                'cashflow' => $cashflow,
                'metrics' => $metrics ?? (object)[]
            ]
        ]);
    }
}
