/**
 * از عنوان انگلیسی (که ممکنه HTML باشه، چون از RichTextEditor میاد) یه
 * اسلاگ URL-friendly می‌سازه — پایین حروف، فاصله/کاراکترهای غیرمجاز به
 * خط تیره، بدون خط تیره‌ی تکراری یا انتهایی.
 */
export function slugify(text) {
    return (text ?? "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
