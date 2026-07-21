<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $columns = [
            'categories' => ['name'],
            'products' => ['title', 'description', 'attributes'],
            'news' => ['title', 'content'],
            'order_items' => ['product_title_snapshot', 'product_description_snapshot'],
        ];

        foreach ($columns as $table => $tableColumns) {
            foreach ($tableColumns as $column) {
                DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} TYPE jsonb USING {$column}::jsonb");
            }
        }
    }

    public function down(): void
    {
        $columns = [
            'categories' => ['name'],
            'products' => ['title', 'description', 'attributes'],
            'news' => ['title', 'content'],
            'order_items' => ['product_title_snapshot', 'product_description_snapshot'],
        ];

        foreach ($columns as $table => $tableColumns) {
            foreach ($tableColumns as $column) {
                DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} TYPE json USING {$column}::json");
            }
        }
    }
};
