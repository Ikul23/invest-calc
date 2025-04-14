<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'npv',
        'irr',
        'dpbp',
        'pp',
        'discount_rate',
        'depreciation_total',
        'ebit_total',
        'net_income_total',
        'working_capital_total',
        'initial_investment',
        'average_tax_rate',
        'cumulative_cashflow'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
