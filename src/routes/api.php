<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController; 
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\FollowController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\PrivatePostController;
use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\API\GroupUserController;
use App\Http\Controllers\API\GroupPostController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\WordleController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\GameController;
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

// ユーザー情報
Route::get('getuser', [UserController::class, 'getuser']);

// ログイン中のみ使用可能 ///////////////////////////////////
Route::middleware('auth:sanctum')->group(function() {

    // ログアウト
    Route::post('logout', [AuthController::class, 'logout']);

    // フォロー
    Route::post('follow', [FollowController::class, 'follow']);
    Route::post('unfollow', [FollowController::class, 'unfollow']);
    Route::get('ffcheck', [FollowController::class, 'ffcheck']);

    // 投稿
    Route::post('post', [PostController::class, 'post']);
    Route::post('privatepost', [PrivatePostController::class, 'privatePost']);

    // グループ
    Route::get('getgroup', [GroupController::class, 'getGroup']);
    Route::post('creategroup', [GroupController::class, 'createGroup']);
    Route::post('joingroup', [GroupUserController::class, 'joinGroup']);
    Route::post('leavegroup', [GroupUserController::class, 'leaveGroup']);
    Route::post('grouppost', [GroupPostController::class, 'groupPost']);

    // 通知
    Route::get('notifications', [NotificationController::class, 'notifications']);
    Route::get('unreadnotifications', [NotificationController::class, 'unreadNotifications']);
    Route::post('readnotification', [NotificationController::class, 'readNotification']);
    Route::post('readallnotifications', [NotificationController::class, 'readAllNotifications']);

    
    // Wordles
    Route::post('wordle/create', [WordleController::class, 'create']);
    Route::get('wordle/show', [WordleController::class, 'show']);
    Route::post('wordle/update', [WordleController::class, 'update']);
    Route::post('wordle/destroy', [WordleController::class, 'destroy']);
    Route::get('wordle/search', [WordleController::class, 'search']);

    // comments
    Route::post('comment/create', [CommentController::class, 'create']);
    Route::post('comment/update', [CommentController::class, 'update']);
    Route::post('comment/destroy', [CommentController::class, 'destroy']);

    // games
    Route::post('game/create', [GameController::class, 'create']);
    Route::get('game/show', [GameController::class, 'show']);
    Route::get('game/search', [GameController::class, 'search']);
    Route::post('game/entry', [GameController::class, 'entry']);
    Route::post('game/leave', [GameController::class, 'leave']);
    Route::post('game/ready', [GameController::class, 'ready']);
    Route::post('game/start', [GameController::class, 'start']);
    Route::post('game/input', [GameController::class, 'input']);
});