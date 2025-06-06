<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// Проверим текущее окружение
$isLocal = env('APP_ENV') === 'local';

// Временная отладка подключения к БД
Route::get('/db-config', function () use ($isLocal) {
    return [
        'APP_ENV'         => env('APP_ENV'),
        'env_db_host'     => env('DB_HOST'),
        'config_db_host'  => config('database.connections.pgsql.host'),
        'config_database' => config('database.connections.pgsql.database'),
        'all_config'      => config('database.connections.pgsql'),
        'is_local_env'    => $isLocal,
    ];
});

// Основной SPA-роутинг
Route::get('/', function () {
    return view('app');
});

Route::get('/test-db', function () {
    try {
        \DB::connection()->getPdo();
        return '✅ DB connected!';
    } catch (\Exception $e) {
        return response()->json([
            'status' => '❌ DB error',
            'message' => $e->getMessage(),
        ]);
    }
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
