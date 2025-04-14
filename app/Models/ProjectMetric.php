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
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
