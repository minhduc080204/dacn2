<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductView;
use App\Models\SearchLog;
use Illuminate\Support\Facades\Log;

class TrackingController extends Controller
{
    /**
     * Thu thập lượt xem sản phẩm
     */
    public function storeView(Request $request)
    {
        // $request->validate([
        //     'product_id' => 'required|exists:products,id',
        //     'device_id' => 'nullable|string',
        // ]);

        ProductView::create([
            'user_id' => $request->input('user_id'),
            'product_id' => $request->input('product_id'),
            'device_id' => $request->input('device_id'),
        ]);

        return response()->json(['message' => 'Logged view'], 201);
    }

    /**
     * Thu thập từ khóa tìm kiếm
     */
    public function storeSearch(Request $request)
    {
        $request->validate([
            'keyword' => 'required|string|max:255',
        ]);

        SearchLog::create([
            'user_id' => $request->user()->id ?? null,
            'keyword' => $request->keyword,
        ]);

        return response()->json(['message' => 'Logged search'], 201);
    }
}
