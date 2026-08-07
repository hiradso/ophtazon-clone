const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * هر رشته یا عدد لاتین را می‌گیرد و ارقام آن را به فارسی تبدیل می‌کند.
 * فقط وقتی locale فارسی باشد اعمال می‌شود؛ در غیر این صورت مقدار اصلی
 * بدون تغییر برگردانده می‌شود — یعنی همه‌جا امن است این تابع را صدا بزنید،
 * حتی برای EN/FR.
 *
 * مثال: toFa(1234, 'fa') -> '۱۲۳۴'
 *       toFa('EUR 1,200.50', 'fa') -> 'EUR ۱,۲۰۰.۵۰'
 *       toFa(1234, 'en') -> '1234' (بدون تغییر)
 */
export function toFa(value, locale) {
    if (value === null || value === undefined) return value;

    const str = String(value);
    if (locale !== "fa") return str;

    return str.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[digit]);
}
