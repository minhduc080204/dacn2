<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id
        ]);

        return response()->json(['message' => 'Added to favorites'], 201);
    }

    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        Favorite::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->delete();

        return response()->json(['message' => 'Removed from favorites']);
    }

    public function list(Request $request)
    {
        $favorites = Favorite::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($favorites);
    }
}
