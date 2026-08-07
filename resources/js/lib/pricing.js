const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toFaDigits(str) {
    return str.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[digit]);
}

export function hasDiscount(discountPercentage) {
    return Boolean(discountPercentage) && discountPercentage > 0;
}

export function getDiscountedPrice(price, discountPercentage) {
    if (!hasDiscount(discountPercentage)) return Number(price);
    const discounted = Number(price) * (1 - discountPercentage / 100);
    return Math.round(discounted * 100) / 100;
}

/**
 * قیمت را فرمت می‌کند. اگر locale برابر 'fa' باشد، ارقام خروجی
 * خودکار به فارسی تبدیل می‌شوند — پارامتر locale اختیاری است،
 * پس فراخوانی‌های قدیمی بدون locale همچنان کار می‌کنند (لاتین می‌مانند).
 */
export function formatPrice(price, locale) {
    const num = Number(price);
    const formatted = Number.isInteger(num) ? num.toString() : num.toFixed(2);
    return locale === "fa" ? toFaDigits(formatted) : formatted;
}
