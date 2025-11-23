<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    public function getForUser($userId)
    {
        // Lấy version mới nhất
        $latestVersion = DB::table('recommendations')->max('version');

        if (!$latestVersion) {
            return response()->json([
                'message' => 'No recommendation data available'
            ], 404);
        }

        // Lấy danh sách product recommend
        $data = DB::table('recommendations as r')
            ->join('products as p', 'p.id', '=', 'r.product_id')
            ->where('r.user_id', $userId)
            ->where('r.version', $latestVersion)
            ->orderByDesc('r.score')
            ->select(
                'p.id',
                'p.name',
                'p.price',
                'p.image',
                'p.description',
                'p.description',
                'p.weight',
                'p.image',
                'r.score'
            )
            ->get();

        return response()->json([
            'user_id' => $userId,
            'version' => $latestVersion,
            'count' => $data->count(),
            'products' => $data
        ]);
    }


    /**
     * ✅ API: Gợi ý cho khách chưa login (theo device_id)
     */
    public function getForGuest(Request $request)
    {
        $deviceId = $request->query('device_id');

        if (!$deviceId) {
            return response()->json([
                'message' => 'device_id is required'
            ], 400);
        }

        $latestVersion = DB::table('recommendations')->max('version');

        $data = DB::table('recommendations as r')
            ->join('products as p', 'p.id', '=', 'r.product_id')
            ->where('r.user_id', $deviceId)
            ->where('r.version', $latestVersion)
            ->orderByDesc('r.score')
            ->select(
                'p.id',
                'p.name',
                'p.price',
                'p.image',
                'r.score'
            )
            ->get();

        return response()->json([
            'device_id' => $deviceId,
            'version' => $latestVersion,
            'count' => $data->count(),
            'products' => $data
        ]);
    }
}
