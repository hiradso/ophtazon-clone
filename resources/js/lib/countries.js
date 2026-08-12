/**
 * نام کشور در دیتابیس فقط انگلیسی ذخیره می‌شود (ستون ساده، نه JSONB).
 * این نگاشت برای نمایش نام محلی‌شده + پرچم هر کشور در رابط کاربری است،
 * بدون نیاز به تغییر ساختار دیتابیس.
 */
const COUNTRY_INFO = {
    FR: { en: "France", fr: "France", fa: "فرانسه", flag: "🇫🇷" },
    CI: { en: "Ivory Coast", fr: "Côte d'Ivoire", fa: "ساحل عاج", flag: "🇨🇮" },
    SN: { en: "Senegal", fr: "Sénégal", fa: "سنگال", flag: "🇸🇳" },
    CM: { en: "Cameroon", fr: "Cameroun", fa: "کامرون", flag: "🇨🇲" },
    TG: { en: "Togo", fr: "Togo", fa: "توگو", flag: "🇹🇬" },
};

export function countryName(country, locale) {
    if (!country) return "";
    const info = COUNTRY_INFO[country.iso_code];
    return info?.[locale] ?? info?.en ?? country.name;
}

export function countryFlag(country) {
    return country ? (COUNTRY_INFO[country.iso_code]?.flag ?? "") : "";
}

export function countryLabel(country, locale) {
    if (!country) return "";
    const flag = countryFlag(country);
    const name = countryName(country, locale);
    return flag ? `${flag} ${name}` : name;
}
