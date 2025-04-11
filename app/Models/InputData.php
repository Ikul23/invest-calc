<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InputData extends Model
{
    protected $fillable = [
        'project_name',
        'year',
        'opex',
        'capex',
        'revenue',
    ];
}
