<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\ContactRequestController;
use App\Http\Controllers\Admin\ContactRequestController as AdminContactRequestController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController as ControllersProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/products', [ControllersProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ControllersProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'role:admin,staff'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('contact-requests', [AdminContactRequestController::class, 'index'])->name('contact-requests.index');
        Route::put('contact-requests/{contact_request}', [AdminContactRequestController::class, 'update'])->name('contact-requests.update');
        Route::resource('products', ProductController::class);
        Route::post('products/{product}/images', [ProductController::class, 'storeImage'])
            ->name('products.images.store');
        Route::delete('products/{product}/images/{image}', [ProductController::class, 'destroyImage'])
            ->name('products.images.destroy');
        Route::put('products/{product}/countries', [ProductController::class, 'syncCountries'])
            ->name('products.countries.sync');
        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::resource('brands', BrandController::class)->except(['show']);
        Route::resource('stores', StoreController::class)->except(['show']);
    });
Route::post('/contact-requests', [ContactRequestController::class, 'store'])->name('contact-requests.store');

require __DIR__ . '/auth.php';
