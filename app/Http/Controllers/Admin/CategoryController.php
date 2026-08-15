<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Category::class);

        $categories = Category::query()
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::treeOrdered($categories),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Category::class);

        return Inertia::render('Admin/Categories/Create', [
            'parentOptions' => $this->parentOptions(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::create($request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'category_created_success');
    }

    public function edit(Category $category): Response
    {
        $this->authorize('update', $category);

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'parentOptions' => $this->parentOptions($category),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'category_updated_success');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        if ($category->products()->exists()) {
            return back()->with('error', 'category_cannot_delete_has_products');
        }

        $category->delete();

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'category_deleted');
    }

    /**
     * دسته‌هایی که می‌توان به‌عنوان والد انتخاب کرد — به ترتیب درختی
     * (برای تورفتگی در UI) و بدون دسته‌های سطح ۳ (که چون خودشان
     * پایین‌ترین سطح مجازند، نمی‌توانند فرزند بگیرند). موقع ویرایش،
     * خود دسته و همه‌ی فرزندان/نوه‌هایش هم حذف می‌شوند تا چرخه در
     * سلسله‌مراتب ایجاد نشود.
     */
    private function parentOptions(?Category $excluding = null): array
    {
        $all = Category::orderBy('sort_order')->get(['id', 'name', 'parent_id']);
        $ordered = Category::treeOrdered($all);

        $excludedIds = $excluding ? $excluding->descendantIds() : [];

        return collect($ordered)
            ->reject(fn ($category) => $category->depth >= 2 || in_array($category->id, $excludedIds, true))
            ->values()
            ->all();
    }
}
