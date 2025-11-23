<?php

use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Api\TrendingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategotyController;
use App\Http\Controllers\Api\SlideController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BankController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\SimilarController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TrackingController;
use Illuminate\Support\Facades\Auth;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('')->middleware('api.key')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/categories', [CategotyController::class, 'index']);
    Route::get('/slides', [SlideController::class, 'index']);
    Route::get('/tags', [TagController::class, 'index']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'select']);
    Route::get('/QRcode', [OrderController::class, 'QRcode']);
    Route::get('/bank', [BankController::class, 'index']);
    Route::get('/favorites', [FavoriteController::class, 'list']);
    Route::get('/recommendations/{userId}', [RecommendationController::class, 'getForUser']);
    Route::get('/recommendations-guest', [RecommendationController::class, 'getForGuest']);
    Route::get('/trending', [TrendingController::class, 'getTopTrending']);
    Route::get('/similar/{productId}', [SimilarController::class, 'getSimilarProducts']);

    Route::post('/discount', [CouponController::class, 'index']);
    Route::post('/checkdiscount', [CouponController::class, 'checkDiscount']);
    Route::post('/order/create', [OrderController::class, 'newOrder']);
    Route::post('/message', [MessageController::class, 'getMessage']);
    Route::post('/favorite/add', [FavoriteController::class, 'add']);
    Route::post('/favorite/remove', [FavoriteController::class, 'remove']);
    Route::post('/sendmessage', [MessageController::class, 'sendMessage'])->name('sendmessage');

    Route::prefix('/tracking')->group(function () {
        // Lưu lượt xem sản phẩm
        Route::post('/view', [TrackingController::class, 'storeView']);

        // Lưu lịch sử tìm kiếm
        Route::post('/search', [TrackingController::class, 'storeSearch']);
    });
});
Route::group(['prefix' => 'auth'], function () {
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/check', [AuthController::class, 'check'])->name('auth.check');
});

Route::middleware('auth:api')->group(function () {
    Route::post('/me', [AuthController::class, 'me'])->name('auth.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');



    Route::post('/messages', function () {
        $user = Auth::user();

        $message = new App\Models\Message();
        $message->message = request()->get('message', '');
        $message->user_id = $user->id;
        $message->save();

        return ['message' => $message->load('user')];
    });
});
