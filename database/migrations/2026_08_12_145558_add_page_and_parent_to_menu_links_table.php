<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // doctrine/dbal نصب نیست، پس به‌جای Blueprint::change() از SQL خام استفاده می‌کنیم
        DB::statement('ALTER TABLE menu_links ALTER COLUMN url DROP NOT NULL');

        Schema::table('menu_links', function (Blueprint $table) {
            $table->foreignId('page_id')->nullable()->after('url')
                ->constrained('pages')->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->after('page_id')
                ->constrained('menu_links')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_links', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_id');
            $table->dropConstrainedForeignId('page_id');
        });

        DB::statement('ALTER TABLE menu_links ALTER COLUMN url SET NOT NULL');
    }
};
