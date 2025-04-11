<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialData extends Model
{
    protected $fillable = ['project_id', 'year', 'capex', 'opex', 'revenue'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
