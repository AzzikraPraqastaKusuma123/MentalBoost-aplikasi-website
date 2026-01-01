<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DashboardController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Assessment Routes
    Route::post('/submit-test', [AssessmentController::class, 'store']);
    Route::get('/history', [AssessmentController::class, 'history']);

    // Chat Routes
    Route::get('/contacts', [ChatController::class, 'getContacts']);
    Route::get('/messages/{userId}', [ChatController::class, 'getMessages']);
    Route::post('/messages', [ChatController::class, 'sendMessage']);

    // Counselor Routes
    Route::get('/counselor/stats', [DashboardController::class, 'counselorStats']);
    Route::get('/counselor/users', [DashboardController::class, 'getUsersList']);
});
