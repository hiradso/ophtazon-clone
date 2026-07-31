<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE pages ALTER COLUMN title TYPE jsonb USING jsonb_build_object('en', title)");
        DB::statement("ALTER TABLE pages ALTER COLUMN content TYPE jsonb USING CASE WHEN content IS NULL THEN NULL ELSE jsonb_build_object('en', content) END");
        DB::statement("ALTER TABLE pages ALTER COLUMN meta_description TYPE jsonb USING CASE WHEN meta_description IS NULL THEN NULL ELSE jsonb_build_object('en', meta_description) END");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE pages ALTER COLUMN title TYPE varchar(255) USING title->>'en'");
        DB::statement("ALTER TABLE pages ALTER COLUMN content TYPE text USING content->>'en'");
        DB::statement("ALTER TABLE pages ALTER COLUMN meta_description TYPE varchar(255) USING meta_description->>'en'");
    }
};
