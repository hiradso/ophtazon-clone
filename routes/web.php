<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\ContactRequestController;
use App\Http\Controllers\Admin\ContactRequestController as AdminContactRequestController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PageSectionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ProductController as ControllersProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RobotsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\PageController as PublicPageController;
use App\Http\Controllers\Admin\MenuLinkController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\SitemapController;

Route::get('/', [HomeController::class, 'index'])->name('welcome');

Route::get('/robots.txt', [RobotsController::class, 'index'])->name('robots');

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('cart.store');
Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');

Route::middleware('auth')->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/my-orders', [OrderController::class, 'index'])->name('orders.index');
});



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'role:admin,staff'])->name('dashboard');

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
        Route::resource('orders', AdminOrderController::class)->only(['index', 'show', 'update']);
        Route::resource('users', UserController::class)->except(['show']);
        Route::resource('page-sections', PageSectionController::class)->except(['show']);
        Route::post('page-sections/{page_section}/move', [PageSectionController::class, 'move'])->name('page-sections.move');
        Route::resource('pages', PageController::class)->except(['show']);
        Route::resource('menu-links', MenuLinkController::class)->except(['show']);
        // داخل گروه admin:
        Route::get('settings', [SettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
        Route::get('media', [MediaController::class, 'index'])->name('media.index');
        Route::post('media', [MediaController::class, 'store'])->name('media.store');
        Route::delete('media/{medium}', [MediaController::class, 'destroy'])->name('media.destroy');
        Route::get('media-picker', [MediaController::class, 'pickerList'])->name('media-picker.list');
        Route::post('media-picker', [MediaController::class, 'pickerUpload'])->name('media-picker.upload');
        Route::put('media/{medium}', [MediaController::class, 'update'])->name('media.update');
        // داخل گروه admin، کنار بقیه‌ی روت‌های page-sections:
        Route::post('page-sections/reorder', [PageSectionController::class, 'reorder'])->name('page-sections.reorder');
    });


Route::get('/pages/{page:slug}', [PublicPageController::class, 'show'])->name('pages.show');
Route::post('/contact-requests', [ContactRequestController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact-requests.store');
Route::post('/newsletter', [NewsletterController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('newsletter.store');
Route::post('/alerts', [AlertController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('alerts.store');
// بیرون از هر گروه خاصی، کنار بقیه‌ی روت‌های cart:
Route::get('/cart/preview', [CartController::class, 'preview'])->name('cart.preview');

use App\Http\Controllers\LocaleController;

Route::post('/locale/{locale}', [LocaleController::class, 'update'])->name('locale.update');

require __DIR__ . '/auth.php';
