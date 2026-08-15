<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

#[Fillable(['parent_id', 'name', 'slug', 'icon_url', 'sort_order', 'is_active'])]
class Category extends Model
{
    use HasTranslations;

    public $translatable = ['name'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * عمق دسته‌بندی در سلسله‌مراتب (۰ = دسته‌ی اصلی، بدون والد).
     * سقف مجاز پروژه ۳ سطح است: دسته (۰) → زیردسته (۱) → نوع دستگاه (۲).
     */
    public function depth(): int
    {
        $depth = 0;
        $node = $this;

        while ($node->parent_id) {
            $depth++;
            $node = $node->parent;
        }

        return $depth;
    }

    /**
     * آی‌دی خود این دسته به‌همراه همه‌ی فرزندان و نوه‌هایش (حداکثر ۳ سطح
     * پشتیبانی‌شده) — برای فیلتر محصولات بر اساس دسته‌ی والد (که باید
     * محصولات زیردسته‌ها را هم شامل شود) و برای جلوگیری از انتخاب یکی از
     * فرزندان به‌عنوان والد جدید (چرخه در سلسله‌مراتب).
     */
    public function descendantIds(): array
    {
        $ids = [$this->id];

        $childIds = static::where('parent_id', $this->id)->pluck('id')->all();

        foreach ($childIds as $childId) {
            $ids[] = $childId;
            $ids = array_merge($ids, static::where('parent_id', $childId)->pluck('id')->all());
        }

        return array_unique($ids);
    }

    /**
     * یک مجموعه‌ی دسته‌بندی مسطح را به ترتیب درختی (هر والد بلافاصله قبل
     * از فرزندانش) بازمی‌چیند و به هر آیتم یک ویژگی depth اضافه می‌کند —
     * برای تورفتگی در UI (هم پنل ادمین، هم فیلتر عمومی محصولات).
     */
    public static function treeOrdered(\Illuminate\Support\Collection $categories): array
    {
        $byParent = $categories->groupBy('parent_id');

        $walk = function ($parentId, int $depth) use (&$walk, $byParent) {
            return ($byParent->get($parentId) ?? collect())
                ->flatMap(function ($category) use (&$walk, $depth) {
                    $category->depth = $depth;

                    return collect([$category])->merge($walk($category->id, $depth + 1));
                });
        };

        return $walk(null, 0)->values()->all();
    }
}
