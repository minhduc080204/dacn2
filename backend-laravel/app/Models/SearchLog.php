<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchLog extends Model
{
    protected $table = 'search_logs';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'keyword',
        'searched_at'
    ];

    protected $casts = [
        'searched_at' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
