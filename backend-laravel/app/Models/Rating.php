<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $table = 'ratings';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'product_id',
        'rating',
        'comment',
        'rated_at'
    ];

    protected $casts = [
        'rated_at' => 'datetime',
        'rating' => 'integer'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
