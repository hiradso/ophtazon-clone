<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE page_sections DROP CONSTRAINT page_sections_type_check');
        DB::statement("ALTER TABLE page_sections ADD CONSTRAINT page_sections_type_check CHECK (type IN ('hero','categories','latest_products','discounted_products','custom_content'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE page_sections DROP CONSTRAINT page_sections_type_check');
        DB::statement("ALTER TABLE page_sections ADD CONSTRAINT page_sections_type_check CHECK (type IN ('hero','categories','latest_products','custom_content'))");
    }
};
