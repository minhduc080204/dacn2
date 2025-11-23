<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrendingController extends Controller
{
    public function getTopTrending()
    {
        $latest = DB::table('trending_products')->max('version');

        $products = DB::table('trending_products as t')
            ->join('products as p', 'p.id', '=', 't.product_id')
            ->where('t.version', $latest)
            ->orderByDesc('t.score')
            ->limit(6)
            ->select('p.*', 't.score')
            ->get();

        return response()->json($products);
    }
}
