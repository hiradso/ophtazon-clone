import { Head, Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { tt } from "@/lib/i18n";
import { t } from "@/lib/translate";

export default function Index({ categorySections, uncategorizedProducts, pages }) {
    const { locale } = usePage().props;

    return (
        <PublicLayout>
            <Head title={tt("sitemap_title", locale)} />

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
                    {tt("sitemap_title", locale)}
                </h1>
                <p className="mb-10 text-sm text-muted-foreground">
                    {tt("sitemap_intro", locale)}
                </p>

                <div className="space-y-10">
                    {/* صفحات اصلی */}
                    <section>
                        <h2 className="mb-3 text-lg font-semibold text-foreground">
                            {tt("sitemap_main_pages", locale)}
                        </h2>
                        <ul className="grid gap-2 sm:grid-cols-2">
                            <li>
                                <Link
                                    href={route("welcome", { locale })}
                                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                                >
                                    {tt("sitemap_home", locale)}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("products.index", { locale })}
                                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                                >
                                    {tt("sitemap_all_products", locale)}
                                </Link>
                            </li>
                        </ul>
                    </section>

                    {/* دسته‌بندی‌ها و محصولاتشون */}
                    <section>
                        <h2 className="mb-3 text-lg font-semibold text-foreground">
                            {tt("sitemap_categories", locale)}
                        </h2>
                        <div className="grid gap-8 sm:grid-cols-2">
                            {categorySections.map((section) => (
                                <div key={section.id}>
                                    <Link
                                        href={route("products.index", {
                                            locale,
                                            category: section.slug,
                                        })}
                                        className="mb-2 block text-sm font-medium text-foreground hover:underline"
                                    >
                                        {t(section.name, locale)}
                                    </Link>
                                    {section.products.length > 0 && (
                                        <ul className="space-y-1.5 border-s border-border ps-3">
                                            {section.products.map(
                                                (product) => (
                                                    <li key={product.slug}>
                                                        <Link
                                                            href={route(
                                                                "products.show",
                                                                {
                                                                    locale,
                                                                    product: product.slug,
                                                                },
                                                            )}
                                                            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                                                        >
                                                            {t(
                                                                product.title,
                                                                locale,
                                                            )}
                                                        </Link>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* محصولات بدون دسته‌بندی */}
                    {uncategorizedProducts.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-foreground">
                                {tt("sitemap_products", locale)}
                            </h2>
                            <ul className="grid gap-2 sm:grid-cols-2">
                                {uncategorizedProducts.map((product) => (
                                    <li key={product.slug}>
                                        <Link
                                            href={route("products.show", {
                                                locale,
                                                product: product.slug,
                                            })}
                                            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                                        >
                                            {t(product.title, locale)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* صفحات ثابت */}
                    {pages.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-foreground">
                                {tt("sitemap_static_pages", locale)}
                            </h2>
                            <ul className="grid gap-2 sm:grid-cols-2">
                                {pages.map((page) => (
                                    <li key={page.slug}>
                                        <Link
                                            href={route("pages.show", {
                                                locale,
                                                page: page.slug,
                                            })}
                                            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                                        >
                                            {t(page.title, locale)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
