<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    public function inputData()
    {
        return $this->hasMany(InputData::class);
    }

    public function financialData()
    {
        return $this->hasMany(FinancialData::class);
    }

    public function metrics()
    {
        return $this->hasOne(ProjectMetric::class);
    }
}
