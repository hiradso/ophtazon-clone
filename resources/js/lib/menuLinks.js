/**
 * آیتم منو یا آدرس دستی داره یا مستقیم به یک صفحه (Page) وصله.
 * چون صفحات پشت پیشوند زبان‌ان (/{locale}/pages/{slug})، آدرس نهایی
 * باید با locale فعلی ساخته بشه، نه از سرور بیاد.
 */
export function menuLinkHref(link, locale) {
    if (link.page_slug) {
        return route("pages.show", { locale, page: link.page_slug });
    }

    return link.url ?? "#";
}
