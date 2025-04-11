<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

Route::get('/db-config', function () {
    return [
        'env_db_host' => env('DB_HOST'),
        'config_db_host' => config('database.connections.pgsql.host'),
        'all_config' => config('database.connections.pgsql')
    ];
});
