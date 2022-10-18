<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wordle;
use App\Models\Tag;
use App\Models\WordleTag;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class WordleController extends Controller
{
    public function upsert(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // https://qiita.com/hamakou108/items/bc17b46afa8476235d33

            'name'=>'required|max:50',
            'words'=>'required|array',
            'words.*'=>'string|min:5|max:10',
            'input'=>'required|array',
            'input.*'=>[
                'string|',
                Rule::in(['japanese', 'english', 'number', 'typing'])
            ],
            'description'=>'max:255',
            'tags'=>'array',
            'tags.*'=>'max:50',
        ]);

        if($validator->fails()){
            return response()->json([
                'validation_errors'=>$validator->errors(),
            ]);
        } else {
            // CAUTION:updateOrCreateは戻り値に真偽値しか返さないので後ろでエラーが起きる
            $wordle = Wordle::updateOrCreate(
                ['id'=>$request->wordle_id],
                [
                    'name'=>$request->name,
                    'user_id'=>$request->user()->id,
                    'words'=>$request->words,
                    'input'=>$request->input,
                    'description'=>$request->description,
                ]
            );

            foreach ($request->tags as $tag) {
                // タグが無ければ作成する(既にあってもupdateされてしまう)
                $tag_upsert = Tag::updateOrCreate(
                    ['name'=>$tag],
                    [
                        'name'=>$tag
                    ]
                );
            }
            
            $wordle->tags()->sync();

            return response()->json([
                'status'=>200
            ]);
        }
    }
    
    public function show(Request $request)
    {
        $wordle = Wordle::find($request->wordle_id);
        $tags = $wordle->tags()->get();

        return response()->json([
            'id'=>$wordle->id,
            'name'=>$wordle->name,
            'user_id'=>$wordle->user_id,
            'words'=>$wordle->words,
            'input'=>$wordle->input,
            'description'=>$wordle->description,
            'tags'=>$tags,
            'created_at'=>$wordle->created_at,
            'updated_at'=>$wordle->updated_at,
            'status'=>200
        ]);
    }
    
    public function destroy(Request $request)
    {
        $wordle = Wordle::find($request->wordle_id);
        
        if ($wordle->user_id === $request->user()->id) {
            Wordle::destroy($wordle->id);

            return response()->json([
                'status'=>200
            ]);
        }
        else {
            return response()->json([
               'message'=>'Wordleが存在しないか削除権限が無い' 
            ]);
        }
    }
    
    public function search(Request $request)
    {
        $wordles = Wordle::where('user_id', $request->user()->id)->get();

        $datas = [];

        foreach ($wordles as $wordle) {
            $tags = $wordle->tags()->get();
            $data = [
                'id'=>$wordle->id,
                'name'=>$wordle->name,
                'user_id'=>$wordle->user_id,
                'words'=>$wordle->words,
                'input'=>$wordle->input,
                'description'=>$wordle->description,
                'tags'=>$tags,
                'created_at'=>$wordle->created_at,
                'updated_at'=>$wordle->updated_at,
            ];

            array_push($datas, $data);
        }

        return response()->json([
            'wordles'=>$datas,
            'status'=>200
        ]);
    }
}
