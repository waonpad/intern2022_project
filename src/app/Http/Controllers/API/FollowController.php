<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Follow;
use App\Notifications\CommonNotification;

class FollowController extends Controller
{
    public function follow(Request $request) {
        $user = $request->user();
        // https://programmierfrage.com/items/laravel-error-call-to-undefined-method-stdclassnotify-in-laravel-8

        $followed_user = User::where('screen_name', $request->screen_name)->first();

        $exist = Follow::where('following_user_id', $user->id)->where('followed_user_id', $followed_user->id)->first();

        if($exist == null) {
            $follow = Follow::create([
                'following_user_id' => $user->id,
                'followed_user_id' => $followed_user->id,
            ]);
            // $followCount = count(Follow::where('followed_user_id', $request->id)->get());
            // return response()->json(['followCount' => $followCount]);

            $followed_user->notify(new CommonNotification($follow));
            return response()->json(['status' => true]);
        }
        else {
            return response()->json(['status' => false]);
        }
    }

    public function unfollow(Request $request) {
        $user = $request->user();

        $followed_user = User::where('screen_name', $request->screen_name)->first()->id;
        
        $exist = Follow::where('following_user_id', $user->id)->where('followed_user_id', $followed_user->id)->first();

        if($exist == null) {
            return response()->json(['status' => false]);
        }
        else {
            $follow = Follow::where('following_user_id', $user->id)->where('followed_user_id', $followed_user->id)->first();
            $follow->delete();
            // $followCount = count(Follow::where('followed_user_id', $request->id)->get());
            // return response()->json(['followCount' => $followCount]);
            return response()->json(['status' => true]);
        }
    }

    public function ffcheck(Request $request) {
        $id = User::where('screen_name', $request->screen_name)->first()->id;
        $follow = Follow::where('following_user_id', $request->user()->id)->where('followed_user_id', $id)->first();
        $followed = Follow::where('following_user_id', $id)->where('followed_user_id', $request->user()->id)->first();

        return response()->json([
            'myself' => $request->user()->id == $id ? true : false,
            'follow' => $follow ? true : false,
            'followed' => $followed ? true : false,
        ]);
    }
}