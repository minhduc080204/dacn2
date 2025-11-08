<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function orders()
    {
        return $this->belongsTo(Order::class);
    }
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function views()
    {
        return $this->hasMany(ProductView::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function similar()
    {
        return $this->hasMany(SimilarProduct::class, 'product_id');
    }
}
