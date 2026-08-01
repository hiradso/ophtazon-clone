<?php

use App\Models\PageSection;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        PageSection::all()->each(function (PageSection $section) {
            $content = $section->content ?? [];

            foreach (['title', 'subtitle', 'heading', 'body'] as $field) {
                if (isset($content[$field]) && is_string($content[$field])) {
                    $content[$field] = ['en' => $content[$field], 'fr' => ''];
                }
            }

            $section->update(['content' => $content]);
        });
    }

    public function down(): void
    {
        PageSection::all()->each(function (PageSection $section) {
            $content = $section->content ?? [];

            foreach (['title', 'subtitle', 'heading', 'body'] as $field) {
                if (isset($content[$field]) && is_array($content[$field])) {
                    $content[$field] = $content[$field]['en'] ?? '';
                }
            }

            $section->update(['content' => $content]);
        });
    }
};
