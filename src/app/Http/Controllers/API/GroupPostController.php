<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GroupPost;
use App\Events\GroupPosted;

class GroupPostController extends Controller
{
    public function groupPost(Request $request)
    {
        $user = $request->user();

        $group_post = GroupPost::create([
            'user_id' => $user->id,
            'group_id' => $request->group_id,
            'text' => $request->text,
        ]);

        event(new GroupPosted($group_post, $user));

        return response()->json([
            'message' => '投稿しました。'
        ]);
    }
}
