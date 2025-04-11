<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InputDataController;

Route::middleware('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/input-data', [InputDataController::class, 'store']);
});
