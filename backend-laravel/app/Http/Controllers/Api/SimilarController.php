<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SimilarController extends Controller
{
    public function getSimilarProducts($productId)
    {
        $latest = DB::table('similar_products')->max('version');

        $products = DB::table('similar_products as t')
            ->join('products as p', 'p.id', '=', 't.similar_id')
            ->where('t.version', $latest)
            ->where('t.product_id', $productId)
            ->orderByDesc('t.score')
            ->limit(6)
            ->select('p.*', 't.score')
            ->get();
            // ->join('products as p', 'p.id', '=', 't.similar_id')
            // ->where('t.version', $latest)
            // ->where('t.product_id', $productId)
            // ->select('p.*', 't.score')
            // ->orderByDesc('t.score')
            // ->distinct()
            // ->limit(6)
            // ->get();
        Log::info("Product ".$products);
        return response()->json($products);
    }
}
