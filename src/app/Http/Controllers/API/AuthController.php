<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    public function register(RegisterRequest $request){
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        } else {
            $user = User::create([
                'screen_name' => $request->screen_name,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken($user->email.'_Token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'status' => true,
                'message' => 'Registerd Successfully'
            ]);
        }
    }

    public function login(LoginRequest $request) {
        $validator = $request->getValidator();
        if ($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        } else {
            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => '入力情報が不正です',
                ]);
            } 
            else if (null !== $request->bearerToken()) {
                return response()->json([
                    'status' => false,
                    'message' => '既にログインしています',
                ]);
            } else {
                $token = $user->createToken($user->email.'_Token')->plainTextToken;

                return response()->json([
                    'user' => $user,
                    'token' => $token,
                    'status' => true,
                    'message' => 'ログインに成功しました。'
                ]);
            }
        }
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => true,
            'message' => 'ログアウト成功',
        ]);
    }
}