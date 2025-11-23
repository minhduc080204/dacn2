<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\UserStoreRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(UserStoreRequest $request)
    {
        $user = User::create([
            'user_name' => $request->user_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        return $this->respondWithToken(auth('api')->login($user));
    }
    
    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $this->respondWithToken($token);
    }

    // public function check(Request $request){        
    //     $user = User::where('email', $request->email)->first();
    //     Log::error($request);
    //     if (!$user) {
    //         return response()->json([
    //             'id' => -1,
    //         ]);
    //     }

    //     return $this->respondWithToken(auth('api')->login($user));        
    // }
    public function check(Request $request)
{
    $user = User::where('email', $request->email)->first();
    Log::error($request->all());

    if (!$user) {
        return response()->json(['id' => -1]);
    }

    try {
        $token = auth('api')->login($user);
        return $this->respondWithToken($token);
    } catch (\Exception $e) {
        Log::error('JWT error: '.$e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function me()
    {
        return response()->json(auth('api')->user());
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user()
        ]);
    }
}
