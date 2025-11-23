<?php

namespace Database\Seeders;

use App\Models\ProductView;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductViewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $data = [
            // User 1 thích product (1,2,3)
            [1, 1], [1, 1], [1, 2], [1, 2], [1, 3],
            [1, 1, '-1 day'], [1, 2, '-2 days'],

            // User 2 thích product (4,5,6)
            [2, 4], [2, 5], [2, 6],
            [2, 6, '-1 day'], [2, 5, '-3 days'],

            // User 3 xem mọi thứ (đa dạng)
            [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],

            // User 4 chỉ thích product 2
            [4, 2], [4, 2, '-1 day'], [4, 2, '-2 days'], [4, 2, '-3 days'],

            // User 5 thích product 3 và 4
            [5, 3], [5, 4], [5, 3, '-2 days'],

            // User 6 random
            [6, 1], [6, 5], [6, 6], [6, 1, '-1 day'], [6, 6, '-4 days'],
        ];

        foreach ($data as $row) {
            $userId = $row[0];
            $productId = $row[1];
            $timeAdjust = $row[2] ?? null;

            ProductView::create([
                'user_id'   => $userId,
                'product_id'=> $productId,
                'device_id' => 'dev-' . $userId,
                'viewed_at' => $timeAdjust ? $now->copy()->modify($timeAdjust) : $now,
            ]);
        }
    }
}
