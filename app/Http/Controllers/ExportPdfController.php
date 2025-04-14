<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ExportPdfController extends Controller
{
    public function export(Request $request)
    {
        $data = $request->validate([
            'project_name' => 'required|string',
            'cashFlows' => 'required|array',
            'npv' => 'required|numeric',
            'irr' => 'required|numeric',
            'dpbp' => 'required|numeric',
        ]);

        $pdf = Pdf::loadView('pdf.report', [
            'projectName' => $data['project_name'],
            'cashFlows' => $data['cashFlows'],
            'npv' => $data['npv'],
            'irr' => $data['irr'],
            'dpbp' => $data['dpbp'],
            'taxRate' => 25,
            'discountRate' => 10
        ]);

        return $pdf->download("{$data['project_name']}_report.pdf");
    }
}
