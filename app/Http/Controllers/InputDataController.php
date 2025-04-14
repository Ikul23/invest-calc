<?php

namespace App\Http\Controllers;

use App\Models\InputData;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InputDataController extends Controller
{
    public function store(Request $request)
    {
        \DB::beginTransaction();
        try {
            $data = $request->validate([
                'project_name' => 'required|string|max:255',
                'financial_data' => 'required|array',
                'financial_data.*.year' => 'required|integer|min:2000|max:2100',
                'financial_data.*.opex' => 'required|numeric|min:0',
                'financial_data.*.capex' => 'required|numeric|min:0',
                'financial_data.*.revenue' => 'required|numeric|min:0',
            ]);

            $project = Project::create([
                'name' => $data['project_name'],
                'slug' => Str::slug($data['project_name']) . '-' . time(),
            ]);

            \DB::commit();
            return response()->json([
                'message' => 'Данные успешно сохранены',
                'project_id' => $project->id
            ], 201);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Ошибка сервера',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
