<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;

class likeController extends Controller
{
    public function likeToggle(Request $request) {
        $user = $request->user();
        $toggle_result = $user->likes()->toggle($request->post_id);

        if(in_array($request->post_id, $toggle_result['attached'])) {
            $like_status = true;
        }
        else if(in_array($request->post_id, $toggle_result['detached'])) {
            $like_status = false;
        }

        // 通知を送る

        return response()->json([
            'status' => true,
            'like_status' => $like_status,
        ]);
    }
}
