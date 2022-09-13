<?php
declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\Posted;
use App\Events\PrivatePosted;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PostController extends Controller
{
    public function post(Request $request) {
        $post = Post::create([
            'text' => $request->text,
        ]);
        event(new Posted($post));

        return response()->json(['message' => '投稿しました。']);
    }

    public function privatepost(Request $request) {
        $privatepost = Post::create([
            'text' => $request->text,
        ]);

        $user = $request->user();

        event(new PrivatePosted($privatepost, $user));

        return response()->json([
            'message' => '投稿しました。',
            'test' => $user->id
        ]);
    }
}