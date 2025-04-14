<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InputData extends Model
{
    use HasFactory;

    protected $table = 'input_data';

    protected $fillable = [
        'project_id',
        'project_name',
        'year',
        'revenue',
        'opex',
        'capex',
        'depreciation',
        'ebit',
        'tax',
        'net_income',
        'working_capital',
        'cashflow',
        'npv'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
