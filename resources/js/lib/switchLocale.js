/**
 * زبان را عوض می‌کند — به‌طور خودکار بین دو حالت تشخیص می‌دهد:
 *
 * ۱. سایت عمومی (آدرس با /en, /fr, یا /fa شروع می‌شود): چون زبان اینجا
 *    از خودِ URL می‌آید نه session، به‌جای درخواست به سرور، مستقیم و
 *    کاملاً سمت مرورگر به همان صفحه ولی با پیشوند زبان جدید هدایت می‌کند.
 *
 * ۲. پنل مدیریت (آدرس با هیچ‌کدام از این پیشوندها شروع نمی‌شود): همچنان
 *    از مکانیزم قبلی (POST به سرور، ذخیره در session، رفرش کامل) استفاده
 *    می‌کند — چون پنل مدیریت عمداً بدون پیشوند زبان مانده است.
 */
export function switchLocale(locale) {
    const currentPath = window.location.pathname;
    const publicLocaleMatch = currentPath.match(/^\/(en|fr|fa)(\/|$)/);

    if (publicLocaleMatch) {
        // حالت سایت عمومی — فقط پیشوند زبان را در همان مسیر جایگزین می‌کنیم
        const newPath = currentPath.replace(
            /^\/(en|fr|fa)(\/|$)/,
            `/${locale}$2`,
        );
        window.location.href = newPath + window.location.search;
        return;
    }

    // حالت پنل مدیریت — همان مکانیزم قبلی مبتنی بر session
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    const form = document.createElement("form");
    form.method = "POST";
    form.action = route("locale.update", locale);
    form.style.display = "none";

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "_token";
    csrfInput.value = csrfToken ?? "";
    form.appendChild(csrfInput);

    document.body.appendChild(form);
    form.submit();
}
