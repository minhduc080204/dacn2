<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $table = 'favorites';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'product_id',
        'favorited_at'
    ];

    protected $casts = [
        'favorited_at' => 'datetime'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
