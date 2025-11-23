<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    protected $table = 'recommendations';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'product_id',
        'score',
        'created_at'
    ];

    protected $casts = [
        'score' => 'float',
        'created_at' => 'datetime'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
