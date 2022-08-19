<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function follow(Request $request) {
        $id = User::where('screen_name', $request->screen_name)->first()->id;

        $exist = Follow::where('following_user_id', Auth::user()->id)->where('followed_user_id', $id)->first();

        if($exist == null) {
            $follow = Follow::create([
                'following_user_id' => Auth::user()->id,
                'followed_user_id' => $id,
            ]);
            // $followCount = count(Follow::where('followed_user_id', $request->id)->get());
            // return response()->json(['followCount' => $followCount]);
            return response()->json(['status' => true]);
        }
        else {
            return response()->json(['status' => false]);
        }
    }

    public function unfollow(Request $request) {
        $id = User::where('screen_name', $request->screen_name)->first()->id;
        
        $exist = Follow::where('following_user_id', Auth::user()->id)->where('followed_user_id', $id)->first();

        if($exist == null) {
            return response()->json(['status' => false]);
        }
        else {
            $follow = Follow::where('following_user_id', Auth::user()->id)->where('followed_user_id', $id)->first();
            $follow->delete();
            // $followCount = count(Follow::where('followed_user_id', $request->id)->get());
            // return response()->json(['followCount' => $followCount]);
            return response()->json(['status' => true]);
        }
    }

    public function ffcheck(Request $request) {
        $id = User::where('screen_name', $request->screen_name)->first()->id;
        $follow = Follow::where('following_user_id', Auth::user()->id)->where('followed_user_id', $id)->first();
        $followed = Follow::where('following_user_id', $id)->where('followed_user_id', Auth::user()->id)->first();

        return response()->json([
            'myself' => Auth::user()->id == $id ? true : false,
            'follow' => $follow ? true : false,
            'followed' => $followed ? true : false,
        ]);
    }
}