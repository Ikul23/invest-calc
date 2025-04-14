<?php

namespace App\Http\Controllers;

use App\Models\InputData;
use App\Models\ProjectMetric;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportPdfController extends Controller
{
    public function export(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|integer|exists:projects,id',
        ]);

        $cashflows = InputData::where('project_id', $data['project_id'])
            ->orderBy('year')
            ->get();

        $metrics = ProjectMetric::where('project_id', $data['project_id'])->first();

        if (!$cashflows->count() || !$metrics) {
            return response()->json(['error' => 'Данные не найдены'], 404);
        }

        $pdf = Pdf::loadView('pdf.report', [
            'project_name' => $cashflows->first()->project_name,
            'cashflows' => $cashflows,
            'metrics' => $metrics
        ]);

        return $pdf->download($cashflows->first()->project_name . '_report.pdf');
    }
}
