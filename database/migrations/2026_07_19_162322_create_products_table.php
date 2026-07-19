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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->json('title');
            $table->json('description')->nullable();
            $table->string('slug')->unique();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('store_id')->constrained()->restrictOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('condition', ['new', 'used', 'refurbished']);
            $table->enum('status', ['draft', 'pending_review', 'available', 'reserved', 'sold', 'archived'])
                ->default('draft');
            $table->decimal('price', 12, 2);
            $table->string('currency', 3)->default('EUR');
            $table->integer('manufacture_year')->nullable();
            $table->integer('warranty_months')->default(0);

            $table->boolean('is_checked')->default(false);
            $table->boolean('is_africa_only')->default(false);
            $table->json('attributes')->nullable();

            $table->unsignedInteger('views_count')->default(0);
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'category_id']);
            $table->index(['store_id', 'status']);
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
