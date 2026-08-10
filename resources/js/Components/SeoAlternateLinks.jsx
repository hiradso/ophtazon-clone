import { usePage } from "@inertiajs/react";

/**
 * تگ‌های canonical و hreflang را برای مسیر فعلی می‌سازد —
 * به‌جای نوشتن ۵ تگ جدا در هر صفحه، کافی است این کامپوننت را با
 * مسیر (بدون پیشوند زبان) صدا بزنید، مثلاً:
 * <SeoAlternateLinks path={`/products/${product.slug}`} />
 * یا برای صفحه‌ی اصلی: <SeoAlternateLinks path="" />
 */
export default function SeoAlternateLinks({ path = "" }) {
    const { locale, appUrl } = usePage().props;

    return (
        <>
            <link
                key="canonical"
                rel="canonical"
                href={`${appUrl}/${locale}${path}`}
            />
            <link
                key="hreflang-en"
                rel="alternate"
                hrefLang="en"
                href={`${appUrl}/en${path}`}
            />
            <link
                key="hreflang-fr"
                rel="alternate"
                hrefLang="fr"
                href={`${appUrl}/fr${path}`}
            />
            <link
                key="hreflang-fa"
                rel="alternate"
                hrefLang="fa"
                href={`${appUrl}/fa${path}`}
            />
            <link
                key="hreflang-default"
                rel="alternate"
                hrefLang="x-default"
                href={`${appUrl}/en${path}`}
            />
        </>
    );
}
