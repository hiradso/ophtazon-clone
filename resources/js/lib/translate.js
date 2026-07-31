export function t(field, locale) {
    if (!field) return "";
    return field[locale] || field.en || "";
}
