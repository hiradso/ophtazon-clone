const LOCALE_TAGS = { en: "en-US", fr: "fr-FR", fa: "fa-IR" };

export function hasDiscount(discountPercentage) {
    return Boolean(discountPercentage) && discountPercentage > 0;
}

export function getDiscountedPrice(price, discountPercentage) {
    if (!hasDiscount(discountPercentage)) return Number(price);
    const discounted = Number(price) * (1 - discountPercentage / 100);
    return Math.round(discounted * 100) / 100;
}

/**
 * قیمت را با جداکننده‌ی هزارگان مناسب همون زبان فرمت می‌کند (کاما در
 * انگلیسی، فاصله در فرانسه، ٬ در فارسی) و ارقام رو هم به رسم‌الخط
 * همون زبان تبدیل می‌کند — همه با Intl.NumberFormat خود مرورگر،
 * بدون نیاز به تبدیل دستی رقم به رقم.
 */
export function formatPrice(price, locale) {
    const num = Number(price) || 0;
    const tag = LOCALE_TAGS[locale] ?? "en-US";
    return new Intl.NumberFormat(tag, {
        minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * کد سه‌حرفی ارز را به یک نشان کوتاه و آشنا تبدیل می‌کند. برای تومان
 * نماد یونیکد جاافتاده‌ای وجود ندارد، پس همون کلمه (تومان/Toman)
 * نمایش داده می‌شود که تو سایت‌های فارسی هم رسمه.
 */
export function currencySymbol(code, locale) {
    switch (code) {
        case "USD":
            return "$";
        case "EUR":
            return "€";
        case "IRT":
            return locale === "fa" ? "تومان" : "Toman";
        default:
            return code;
    }
}
