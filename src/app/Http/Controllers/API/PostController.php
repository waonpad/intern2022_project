<?php
declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\Posted;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Requests\UpsertPostRequest;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::get();

        return response()->json([
            'status' => true,
            'post' => $posts
        ]);
    }

    public function upsert(UpsertPostRequest $request) {
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        } else {
            $user = $request->user();
        
            $post = Post::updateOrCreate([
                'title' => $request->title,
                'comment' => $request->comment,
                'user_id' => $user->id
            ]);

            $category_id_array = [];
            foreach ($request->categoriess as $category) {
                $target_category_id = Tag::firstOrCreate(
                    ['name'=>$category],
                    [
                        'name'=>$category
                    ]
                )->id;
                array_push($category_id_array, $target_category_id);
            }

            $post->categories->sync($category_id_array);

            event(new Posted($post));

            return response()->json([
                'status' => true,
                'message' => '投稿しました。'
            ]);
        }
        
        public function show(Request $request)
        {
            $post = Post::find($request->post_id);

            return response()->json([
                'status' => true,
                'post' => $post
            ]);
        }

        public function destroy(Request $request)
        {
            $post = Post::find($request->post_id);
            
            if ($post->user_id === $request->user()->id) {
                Post::destroy($post->id);

                // 削除イベントを送信する
    
                return response()->json([
                    'status' => true
                ]);
            }
            else {
                return response()->json([
                    'status' => false,
                    'message' => 'Postが存在しないか削除権限が無い'
                ]);
            }
        }

        public function search(Request $request)
        {
            $posts = Post::where('user_id', $request->user()->id)->get();
    
            return response()->json([
                'status' => true,
                'posts' => $posts
            ]);
        }
    }
}