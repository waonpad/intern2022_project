<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController; 
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\FollowController;
use App\Http\Controllers\API\PostController;

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user(); // ログイン中のユーザー情報を取得
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('follow', [FollowController::class, 'follow']);
    Route::post('unfollow', [FollowController::class, 'unfollow']);
    Route::get('ffcheck', [FollowController::class, 'ffcheck']);
    Route::post('post', [PostController::class, 'post']);
    Route::post('privatepost', [PostController::class, 'privatepost']);
});

Route::get('getuser', [UserController::class, 'getuser']);

Broadcast::routes(['middleware' => ['auth:sanctum']]);