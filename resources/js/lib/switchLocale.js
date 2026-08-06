/**
 * زبان سایت را با یک ناوبری کامل و طبیعی مرورگر عوض می‌کند —
 * عمداً از router.post (که مسیر Inertia/XHR است) استفاده نمی‌شود،
 * چون آن روش باعث یک جابه‌جایی جزئی SPA قبل از رفرش کامل می‌شد
 * و یک لحظه‌ی نیمه‌آماده و ناهماهنگ (فونت/جهت اشتباه) به کاربر نشان می‌داد.
 * ساخت و ارسال یک فرم واقعی HTML، یک ناوبری یکپارچه‌ی مرورگری ایجاد می‌کند.
 */
export function switchLocale(locale) {
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
