<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('similar_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('similar_id');
            $table->float('score')->default(0);
            $table->unsignedInteger('version')->default(1);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('similar_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('similar_products');
    }
};
