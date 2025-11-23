<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SimilarProduct extends Model
{
    protected $table = 'similar_products';
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'similar_id',
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

    public function similarProduct() {
        return $this->belongsTo(Product::class, 'similar_id');
    }
}
