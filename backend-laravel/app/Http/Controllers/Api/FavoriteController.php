<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    public function add(Request $request)
    {
        // Log::info('User:', [$request->user()]);

        // $request->validate([
        //     'product_id' => 'required|exists:products,id'
        // ]);

        Favorite::firstOrCreate([
            'user_id' => Auth::guard('api')->user()->id,
            'product_id' => $request->productId
        ]);

        return response()->json(['message' => 'Added to favorites'], 201);
    }

    public function remove(Request $request)
    {
        // $request->validate([
        //     'product_id' => 'required|exists:products,id'
        // ]);

        Favorite::where('user_id', Auth::guard('api')->user()->id)
            ->where('product_id', $request->productId)
            ->delete();

        return response()->json(['message' => 'Removed from favorites']);
    }

    public function list(Request $request)
    {
        $favorites = Favorite::with('product')
            ->where('user_id', Auth::guard('api')->user()->id)
            ->get();
        $products = $favorites->pluck('product');
        return response()->json($products);
    }
}
