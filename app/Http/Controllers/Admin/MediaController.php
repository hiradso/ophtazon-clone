<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

            Media::create([
                'filename' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
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

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => Auth::id(),
        ]);

        return response()->json($media);
    }
}
