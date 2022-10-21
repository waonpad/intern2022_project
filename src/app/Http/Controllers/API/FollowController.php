<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Follow;
use App\Notifications\CommonNotification;

class FollowController extends Controller
{
    
    public function followToggle(Request $request) {
        $user = $request->user();
        $target_user = User::where('screen_name', $request->screen_name)->first();

        $toggle_result = $user->follows()->toggle($target_user->id);
        if(in_array($target_user->id, $toggle_result['attached'])) {
            $follow_status = true;
        }
        else if(in_array($target_user->id, $toggle_result['detached'])) {
            $follow_status = false;
        }

        // 通知を送る

        return response()->json([
            'status' => true,
            'follow_status' => $follow_status,
        ]);
    }

    public function ffcheck($request) {
        $user = $request->user() ?? null;
        if ($user === null) {
            return response()->json([
                'myself' => false,
                'follow' => false,
                'followed' => false,
            ]);
        }

        $target_user = User::where('screen_name', $request->screen_name)->first();
        $follow = Follow::where('following_user_id', $user->id)->where('followed_user_id', $target_user->id)->first();
        $followed = Follow::where('following_user_id', $target_user->id)->where('followed_user_id', $user->id)->first();

        return response()->json([
            'myself' => $user->id == $id ? true : false,
            'follow' => $follow ? true : false,
            'followed' => $followed ? true : false,
        ]);
    }
}