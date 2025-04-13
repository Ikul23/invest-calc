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
        'opex',
        'capex',
        'revenue',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
