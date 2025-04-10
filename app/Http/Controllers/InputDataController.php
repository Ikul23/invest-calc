<?php

namespace App\Http\Controllers;

use App\Models\InputData;
use Illuminate\Http\Request;

class InputDataController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Database config:', \Config::get('database.connections.pgsql'));
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

            foreach ($data['financial_data'] as $entry) {
                \App\Models\InputData::create([
                    'project_name' => $data['project_name'],
                    'year' => $entry['year'],
                    'opex' => $entry['opex'],
                    'capex' => $entry['capex'],
                    'revenue' => $entry['revenue'],
                ]);
            }

            \DB::commit();
            \Log::info('Ответ к фронту:', ['project_name' => $data['project_name']]);
            return response()->json(['message' => 'Данные успешно сохранены'], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('InputData save error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Ошибка сервера',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
