<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrendingProduct extends Model
{
    protected $table = 'trending_products';
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'score',
        'created_at'
    ];

    protected $casts = [
        'score' => 'float',
        'created_at' => 'datetime'
    ];

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
