<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductView extends Model
{
    protected $table = 'product_views';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'product_id',
        'device_id',
        'viewed_at'
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    // Relationships
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
