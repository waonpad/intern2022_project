<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::get();

        return response()->json([
            'status' => true,
            'users' => $users,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {   
        $user = User::where('screen_name', $request->screen_name)->first();

        $follow_controller = app()->make('App\Http\Controllers\API\FollowController');
        $ffcheck = $follow_controller->ffcheck($request->screen_name);

        return response()->json([
            'status' => true,
            'user' => $user,
            'ffcheck' => $ffcheck
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $user->update([
            'name' => $request['name'],
            'description' => $request['description'],
            'age' => $request['age'],
            'gender' => $request['gender']
        ])

        return response()->json([
            'status' => true,
            'user' => $user
        ])
    }
}
