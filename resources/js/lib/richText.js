/**
 * فیلدهایی مثل عنوان صفحه یا Hero حالا از ویرایشگر گرافیکی میان (HTML
 * واقعی با تگ دلخواه ادمین: h1/h2/h3/p). مقادیر قدیمی هنوز متن ساده‌ان
 * (بدون تگ) — برای سازگاری، اگه هیچ تگی توش نبود، با تگ پیش‌فرض می‌پیچیمش.
 */
export function richTextOrLegacy(value, fallbackTag) {
    if (!value) return "";
    return /<[a-z][\s\S]*>/i.test(value)
        ? value
        : `<${fallbackTag}>${value}</${fallbackTag}>`;
}

/**
 * نسخه‌ی متن خام (بدون تگ) — برای جاهایی که HTML قابل رندر نیست
 * (تگ <title> مرورگر، breadcrumb، لیست جدول ادمین).
 */
export function stripHtml(html) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
}
