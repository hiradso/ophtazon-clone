<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewProductAlertNotification extends Notification
{
    use Queueable;

    public function __construct(protected Product $product) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New listing matches your alert')
            ->greeting('A new item just went live!')
            ->line($this->product->title['en'] ?? $this->product->reference)
            ->line("Price: {$this->product->price} {$this->product->currency}")
            ->action('View listing', route('products.show', $this->product->slug))
            ->line('You are receiving this because you set up a product alert on Ophtazon.');
    }
}
