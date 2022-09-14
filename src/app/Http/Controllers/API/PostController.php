<?php
declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\Posted;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function post(Request $request) {
        $post = Post::create([
            'text' => $request->text,
        ]);
        event(new Posted($post));

        return response()->json(['message' => '投稿しました。']);
    }
}