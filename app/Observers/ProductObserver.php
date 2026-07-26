<?php

namespace App\Observers;

use App\Enums\ProductStatus;
use App\Models\Alert;
use App\Models\Product;
use App\Notifications\NewProductAlertNotification;
use Illuminate\Support\Facades\Notification;

class ProductObserver
{
    public function updated(Product $product): void
    {
        if (! $product->wasChanged('status') || $product->status !== ProductStatus::Available) {
            return;
        }

        $matchingAlerts = Alert::query()
            ->where('is_active', true)
            ->where(function ($query) use ($product) {
                $query->whereNull('category_id')->orWhere('category_id', $product->category_id);
            })
            ->where(function ($query) use ($product) {
                $query->whereNull('brand_id')->orWhere('brand_id', $product->brand_id);
            })
            ->where(function ($query) use ($product) {
                $query->whereNull('max_price')->orWhere('max_price', '>=', $product->price);
            })
            ->get();

        foreach ($matchingAlerts as $alert) {
            Notification::route('mail', $alert->email)
                ->notify(new NewProductAlertNotification($product));
        }
    }
}
