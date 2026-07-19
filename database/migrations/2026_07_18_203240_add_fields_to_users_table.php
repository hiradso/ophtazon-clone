<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->enum('role', ['admin', 'staff', 'customer'])->default('customer')->after('phone');
            $table->foreignId('country_id')->nullable()->after('role')->constrained()->nullOnDelete();
            $table->foreignId('store_id')->nullable()->after('country_id')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('store_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['country_id']);
            $table->dropForeign(['strore_id']);
            $table->dropColumn(['phone', 'role', 'country_id', 'store_id', 'is_active']);
        });
    }
};
