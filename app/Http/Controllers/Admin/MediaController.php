<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Media::class);

        return Inertia::render('Admin/Media/Index', [
            'media' => Media::latest()->paginate(24),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Media::class);

        $request->validate([
            'files' => ['required', 'array'],
            'files.*' => ['file', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:4096'],
        ]);

        foreach ($request->file('files') as $file) {
            $path = $file->store('media', 'public');
            [$path, $mimeType] = $this->convertToWebp($file, $path);

            Media::create([
                'filename' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $mimeType,
                'size' => Storage::disk('public')->size($path),
                'uploaded_by' => Auth::id(),
            ]);
        }

        return back()->with('success', 'Files uploaded successfully.');
    }

    public function update(Request $request, Media $medium): RedirectResponse
    {
        $this->authorize('update', $medium);

        $request->validate([
            'filename' => ['required', 'string', 'max:255'],
        ]);

        $medium->update(['filename' => $request->input('filename')]);

        return back()->with('success', 'Renamed successfully.');
    }

    public function destroy(Media $medium): RedirectResponse
    {
        $this->authorize('delete', $medium);

        Storage::disk('public')->delete($medium->path);
        $medium->delete();

        return back()->with('success', 'File deleted.');
    }

    public function pickerList(): JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        return response()->json(
            Media::latest()->limit(60)->get(['id', 'filename', 'path'])
        );
    }

    public function pickerUpload(Request $request): JsonResponse
    {
        $this->authorize('create', Media::class);

        $request->validate([
            'file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:4096'],
        ]);

        $file = $request->file('file');
        $path = $file->store('media', 'public');
        [$path, $mimeType] = $this->convertToWebp($file, $path);

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $mimeType,
            'size' => Storage::disk('public')->size($path),
            'uploaded_by' => Auth::id(),
        ]);

        return response()->json($media);
    }

    /**
     * فایل تصویری ذخیره‌شده را (در صورت امکان) به فرمت WebP تبدیل می‌کند —
     * برای بهبود Core Web Vitals، چون WebP معمولاً ۲۵-۳۵٪ سبک‌تر از JPEG/PNG است.
     * SVG و GIF متحرک عمداً دست‌نخورده می‌مانند (SVG خودش سبک است؛ تبدیل GIF
     * متحرک به WebP نیاز به پردازش فریم‌به‌فریم دارد که فعلاً پیاده‌سازی نشده).
     *
     * @return array{0: string, 1: string} مسیر نهایی و نوع MIME نهایی
     */
    private function convertToWebp(UploadedFile $file, string $path): array
    {
        $mime = $file->getMimeType();

        if (! in_array($mime, ['image/jpeg', 'image/png'], true)) {
            return [$path, $mime];
        }

        if (! function_exists('imagewebp')) {
            // اگر GD روی سرور بدون پشتیبانی WebP کامپایل شده باشد،
            // بی‌صدا از فایل اصلی (بدون تبدیل) استفاده می‌کنیم.
            return [$path, $mime];
        }

        $fullPath = Storage::disk('public')->path($path);

        $image = match ($mime) {
            'image/jpeg' => @imagecreatefromjpeg($fullPath),
            'image/png' => @imagecreatefrompng($fullPath),
            default => null,
        };

        if (! $image) {
            return [$path, $mime];
        }

        // حفظ شفافیت برای عکس‌های PNG
        imagepalettetotruecolor($image);
        imagealphablending($image, true);
        imagesavealpha($image, true);

        $webpPath = preg_replace('/\.[^.]+$/', '.webp', $path);
        $webpFullPath = Storage::disk('public')->path($webpPath);

        $success = imagewebp($image, $webpFullPath, 82);
        imagedestroy($image);

        if (! $success) {
            return [$path, $mime];
        }

        Storage::disk('public')->delete($path);

        return [$webpPath, 'image/webp'];
    }
}
