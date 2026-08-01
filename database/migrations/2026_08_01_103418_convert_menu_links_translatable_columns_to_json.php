<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE menu_links ALTER COLUMN label TYPE jsonb USING jsonb_build_object('en', label)");
        DB::statement("ALTER TABLE menu_links ALTER COLUMN group_label TYPE jsonb USING CASE WHEN group_label IS NULL THEN NULL ELSE jsonb_build_object('en', group_label) END");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE menu_links ALTER COLUMN label TYPE varchar(255) USING label->>'en'");
        DB::statement("ALTER TABLE menu_links ALTER COLUMN group_label TYPE varchar(255) USING group_label->>'en'");
    }
};
