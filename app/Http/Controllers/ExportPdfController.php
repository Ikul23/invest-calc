<?php

namespace App\Http\Controllers;

use App\Models\InputData;
use App\Models\ProjectMetric;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ExportPdfController extends Controller
{
    public function export(Request $request)
    {
        try {
            $data = $request->validate([
                'project_id' => 'required|integer|exists:projects,id',
            ]);

            $cashflows = InputData::where('project_id', $data['project_id'])
                ->orderBy('year')
                ->get();

            $metrics = ProjectMetric::where('project_id', $data['project_id'])->first();

            if (!$cashflows->count() || !$metrics) {
                return response()->json(['error' => 'Project data not found'], 404);
            }

            $projectName = $cashflows->first()->project_name;
            $filename = Str::slug($projectName) . '_report.pdf';

            $pdf = Pdf::loadView('pdf.report', [
                'project_name' => $projectName,
                'cashflows' => $cashflows,
                'metrics' => $metrics
            ]);

            return $pdf->download($filename)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            \Log::error('PDF Export Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to generate PDF'], 500);
        }
    }
}
