<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController; 
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\FollowController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\PrivatePostController;
use App\Http\Controllers\API\GroupController;
// use App\Http\Controllers\API\GroupUserController;
use App\Http\Controllers\API\GroupPostController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\LikeController;
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

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user(); // ログイン中のユーザー情報を取得
});

// 常時使用可能 ////////////////////////////////////////////
// 認証
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// ユーザー
Route::prefix('user')->group(function (){
    Route::get('/index', [UserController::class, 'index']);
    Route::get('/show', [UserController::class, 'show']);
    Route::get('/update', [UserController::class, 'update']);
});

// ログイン中のみ使用可能 ///////////////////////////////////
Route::middleware('auth:sanctum')->group(function() {

    // ユーザー
    Route::prefix('user')->group(function (){
        Route::get('/update', [UserController::class, 'update']);
    });

    // ログアウト
    Route::post('logout', [AuthController::class, 'logout']);

    // フォロー
    Route::post('followtoggle', [FollowController::class, 'followToggle']);
    // Route::post('follow', [FollowController::class, 'follow']);
    // Route::post('unfollow', [FollowController::class, 'unfollow']);
    Route::get('ffcheck', [FollowController::class, 'ffcheck']);

    // 投稿
    Route::prefix('post')->group(function (){
        Route::get('/index', [PostController::class, 'index']);
        Route::get('/show', [PostController::class, 'show']);
        Route::post('/upsert', [PostController::class, 'upsert']);
        Route::post('/destroy', [PostController::class, 'destroy']);
        Route::post('/search', [PostController::class, 'search']);
        Route::post('/liketoggle', [likeController::class, 'likeToggle']);
    });

    // プライベートチャット
    Route::post('privatepost', [PrivatePostController::class, 'privatePost']);

    // グループ
    Route::prefix('group')->group(function (){
        Route::get('/show', [GroupController::class, 'show']);
        Route::post('/create', [GroupController::class, 'create']);
        // Route::post('/join', [GroupUserController::class, 'join']);
        // Route::post('/leave', [GroupUserController::class, 'leave']);
        Route::post('/post', [GroupPostController::class, 'post']);
    });

    // 通知
    Route::prefix('notification')->group(function (){
        Route::get('/index', [NotificationController::class, 'index']);
        Route::get('/unread', [NotificationController::class, 'unread']);
        Route::post('/read', [NotificationController::class, 'read']);
        Route::post('/readall', [NotificationController::class, 'readAll']);
    });
});