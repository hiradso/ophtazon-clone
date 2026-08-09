import { Head, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { t } from "@/lib/translate";

export default function Show({ page }) {
    const { locale } = usePage().props;

    const hasBackgroundImage =
        page.featured_image && page.image_display_style === "background";
    const hasBannerImage =
        page.featured_image && page.image_display_style === "banner";

    const title = t(page.title, locale);
    const content = t(page.content, locale);
    const metaDescription = t(page.meta_description, locale);

    return (
        <PublicLayout>
            <Head title={title}>
                {metaDescription && (
                    <meta name="description" content={metaDescription} />
                )}
                {/* Canonical — به آدرس اصلی صفحه با پیشوند زبان فعلی اشاره می‌کند */}
                <link
                    rel="canonical"
                    href={`${window.location.origin}/${locale}/pages/${page.slug}`}
                />
                {/* Hreflang — به گوگل می‌گوید این صفحه به کدام زبان‌های دیگر هم ترجمه شده است */}
                <link
                    rel="alternate"
                    hrefLang="en"
                    href={`${window.location.origin}/en/pages/${page.slug}`}
                />
                <link
                    rel="alternate"
                    hrefLang="fr"
                    href={`${window.location.origin}/fr/pages/${page.slug}`}
                />
                <link
                    rel="alternate"
                    hrefLang="fa"
                    href={`${window.location.origin}/fa/pages/${page.slug}`}
                />
                <link
                    rel="alternate"
                    hrefLang="x-default"
                    href={`${window.location.origin}/en/pages/${page.slug}`}
                />
            </Head>
            {hasBackgroundImage ? (
                <div
                    className="relative flex h-80 items-end bg-cover bg-center sm:h-96"
                    style={{
                        backgroundImage: `url(/storage/${page.featured_image})`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            {title}
                        </h1>
                    </div>
                </div>
            ) : null}
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                {!hasBackgroundImage && (
                    <h1 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>
                )}
                {hasBannerImage && (
                    <img
                        src={`/storage/${page.featured_image}`}
                        alt=""
                        className="mb-6 h-64 w-full rounded-lg object-cover"
                    />
                )}
                <div
                    className="prose prose-neutral max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </PublicLayout>
    );
}
