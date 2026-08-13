export const PASSWORD_CRITERIA = [
    { key: "length", test: (pw) => pw.length >= 8 },
    { key: "lower", test: (pw) => /[a-z]/.test(pw) },
    { key: "upper", test: (pw) => /[A-Z]/.test(pw) },
    { key: "number", test: (pw) => /[0-9]/.test(pw) },
    { key: "special", test: (pw) => /[^a-zA-Z0-9]/.test(pw) },
];

/**
 * همان منطق امتیازدهی که در app/Rules/StrongPassword.php سمت سرور
 * استفاده می‌شود — این دو باید همیشه هماهنگ بمانند.
 * score 0-2 => weak (مسدود می‌شود)، 3-4 => medium، 5 => strong.
 */
export function getPasswordStrength(password) {
    const checks = PASSWORD_CRITERIA.map((c) => ({
        key: c.key,
        met: c.test(password),
    }));
    const score = checks.filter((c) => c.met).length;
    const strength =
        password.length === 0 ? null : score < 3 ? "weak" : score < 5 ? "medium" : "strong";

    return { score, strength, checks };
}
