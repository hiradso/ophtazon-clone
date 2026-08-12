import { Head, Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { Eye, ImageOff, ArrowRight, Search, ShieldCheck, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { t } from "@/lib/translate";
import { tt } from "@/lib/i18n";
import { formatPrice, hasDiscount } from "@/lib/pricing";
import { toFa } from "@/lib/toFa";
import { HERO_ICONS } from "@/lib/heroIcons";

const DEFAULT_BADGE_TEXT = "Trusted by clinics in 5 countries";

/**
 * تیتر/زیرتیتر Hero حالا از ویرایشگر گرافیکی میان (HTML واقعی با تگ
 * دلخواه ادمین: h1/h2/h3/p). مقادیر قدیمی هنوز متن ساده‌ان (بدون تگ) —
 * برای سازگاری، اگه هیچ تگی توش نبود، با تگ پیش‌فرض می‌پیچیمش.
 */
function richTextOrLegacy(value, fallbackTag) {
    if (!value) return "";
    return /<[a-z][\s\S]*>/i.test(value)
        ? value
        : `<${fallbackTag}>${value}</${fallbackTag}>`;
}

const DEFAULT_TRUST_ITEMS = [
    { icon: "shield_check", labelKey: "quality_checked" },
    { icon: "globe", labelKey: "regional_showrooms" },
    { icon: "truck", labelKey: "international_shipping" },
];

const CONDITION_LABELS = {
    new: "New",
    used: "Used",
    refurbished: "Refurbished",
};

export default function Welcome({
    sections,
    categories,
    latestProducts,
    discountedProducts,
}) {
    const { locale, appUrl } = usePage().props;
    return (
        <PublicLayout>
            <Head title="Ophtazon — Ophthalmic Equipment Marketplace"></Head>

            {sections.map((section) => {
                switch (section.type) {
                    case "hero":
                        return (
                            <HeroSection
                                key={section.id}
                                content={section.content}
                            />
                        );
                    case "categories":
                        return (
                            <CategoriesSection
                                key={section.id}
                                categories={categories}
                            />
                        );
                    case "latest_products":
                        return (
                            <LatestProductsSection
                                key={section.id}
                                products={latestProducts}
                            />
                        );
                    case "discounted_products":
                        return (
                            <DiscountedProductsSection
                                key={section.id}
                                products={discountedProducts}
                            />
                        );
                    case "custom_content":
                        return (
                            <CustomContentSection
                                key={section.id}
                                content={section.content}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </PublicLayout>
    );
}

function HeroSection({ content }) {
    const { locale } = usePage().props;

    const container = {
        hidden: {},
        show: {
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
        },
    };
    const item = {
        hidden: { opacity: 0, y: 18 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const title = t(content?.title, locale);
    const subtitle = t(content?.subtitle, locale);
    const badgeText = t(content?.badge, locale) || DEFAULT_BADGE_TEXT;
    const trustItems =
        content?.trust_items?.length > 0
            ? content.trust_items
            : DEFAULT_TRUST_ITEMS;

    return (
        <section className="relative overflow-hidden bg-primary">
            <div
                className="absolute inset-0 opacity-15"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 20%, white 0%, transparent 35%), radial-gradient(circle at 85% 60%, white 0%, transparent 40%)",
                }}
            />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8"
            >
                <motion.div variants={item}>
                    <Badge
                        variant="outline"
                        className="mb-5 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                    >
                        {badgeText}
                    </Badge>
                </motion.div>

                <motion.div
                    variants={item}
                    className="text-3xl font-semibold tracking-tight text-primary-foreground sm:text-5xl [&>*]:m-0 [&>*]:[font:inherit]"
                    dangerouslySetInnerHTML={{
                        __html: richTextOrLegacy(
                            title || tt("hero_default_title", locale),
                            "h1",
                        ),
                    }}
                />

                {subtitle && (
                    <motion.div
                        variants={item}
                        className="mx-auto mt-4 max-w-2xl text-primary-foreground/80 [&>*]:m-0 [&>*]:[font:inherit]"
                        dangerouslySetInnerHTML={{
                            __html: richTextOrLegacy(subtitle, "p"),
                        }}
                    />
                )}

                <motion.form
                    variants={item}
                    action={route("products.index")}
                    method="get"
                    className="relative mx-auto mt-8 max-w-lg"
                >
                    <Search className="absolute top-1/2 start-4 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        name="q"
                        placeholder={tt("hero_search_placeholder", locale)}
                        className="h-12 w-full rounded-full border-0 bg-background ps-11 pe-32 text-sm text-foreground shadow-lg placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/40"
                    />
                    <Button
                        type="submit"
                        className="absolute top-1/2 end-1.5 -translate-y-1/2 rounded-full bg-foreground text-background hover:bg-foreground/80"
                        size="sm"
                    >
                        {tt("search", locale)}
                    </Button>
                </motion.form>

                <motion.div
                    variants={item}
                    className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/80"
                >
                    {trustItems.map((trustItem, index) => {
                        const Icon = HERO_ICONS[trustItem.icon] ?? ShieldCheck;
                        const label = trustItem.labelKey
                            ? tt(trustItem.labelKey, locale)
                            : t(trustItem.label, locale);

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-1.5"
                            >
                                <Icon className="size-4" />
                                {label}
                            </div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </section>
    );
}

function CategoriesSection({ categories }) {
    const { locale } = usePage().props;

    if (categories.length === 0) return null;

    return (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
                {tt("shop_by_category", locale)}
            </h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                        <Link
                            href={route("products.index", {
                                category: category.slug,
                            })}
                        >
                            <Card className="h-full transition-shadow hover:shadow-md">
                                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                        className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground"
                                    >
                                        <Eye className="size-6" />
                                    </motion.div>
                                    <span className="text-sm font-medium text-foreground">
                                        {t(category.name, locale)}
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function LatestProductsSection({ products }) {
    const { locale } = usePage().props;

    if (products.length === 0) return null;

    return (
        <section className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {tt("latest_listings", locale)}
                    </h2>
                    <Link
                        href={route("products.index")}
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        {tt("view_all", locale)}
                        <ArrowRight className="size-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product, index) => {
                        const discounted = hasDiscount(
                            product.discount_percentage,
                        );

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                }}
                            >
                                <Link
                                    href={route("products.show", product.slug)}
                                >
                                    <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
                                        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-muted">
                                            {discounted && (
                                                <div
                                                    dir="ltr"
                                                    className="absolute top-2 start-2 z-10 rounded bg-destructive px-1.5 py-0.5 text-xs font-semibold text-white shadow"
                                                >
                                                    -
                                                    {toFa(
                                                        product.discount_percentage,
                                                        locale,
                                                    )}
                                                    %
                                                </div>
                                            )}
                                            {product.images?.[0] ? (
                                                <motion.img
                                                    whileHover={{
                                                        scale: 1.08,
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                    }}
                                                    loading="lazy"
                                                    src={`/storage/${product.images[0].url}`}
                                                    alt={t(
                                                        product.title,
                                                        locale,
                                                    )}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImageOff className="size-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <CardContent className="space-y-2 p-4">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {
                                                        CONDITION_LABELS[
                                                            product.condition
                                                        ]
                                                    }
                                                </Badge>
                                                {product.store?.name && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {product.store.name}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="line-clamp-2 font-medium text-foreground">
                                                {t(product.title, locale)}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                {discounted && (
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {formatPrice(
                                                            product.price,
                                                            locale,
                                                        )}
                                                    </span>
                                                )}
                                                <p className="text-lg font-semibold text-foreground">
                                                    {formatPrice(
                                                        product.effective_price,
                                                        locale,
                                                    )}{" "}
                                                    {product.currency}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function DiscountedProductsSection({ products }) {
    const { locale } = usePage().props;

    if (!products || products.length === 0) return null;

    return (
        <section className="border-t border-border bg-gradient-to-b from-destructive/5 to-transparent">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Flame className="size-5 text-destructive" />
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                            {tt("on_sale", locale)}
                        </h2>
                    </div>
                </div>

                <Carousel
                    dir={locale === "fa" ? "rtl" : "ltr"}
                    opts={{
                        align: "start",
                        direction: locale === "fa" ? "rtl" : "ltr",
                    }}
                    className="px-10"
                >
                    <CarouselContent>
                        {products.map((product) => (
                            <CarouselItem
                                key={product.id}
                                className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
                            >
                                <Link
                                    href={route("products.show", product.slug)}
                                >
                                    <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
                                        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-muted">
                                            <div
                                                dir="ltr"
                                                className="absolute top-2 start-2 z-10 rounded bg-destructive px-1.5 py-0.5 text-xs font-semibold text-white shadow"
                                            >
                                                -
                                                {toFa(
                                                    product.discount_percentage,
                                                    locale,
                                                )}
                                                %
                                            </div>
                                            {product.images?.[0] ? (
                                                <motion.img
                                                    whileHover={{
                                                        scale: 1.08,
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                    }}
                                                    loading="lazy"
                                                    src={`/storage/${product.images[0].url}`}
                                                    alt={t(
                                                        product.title,
                                                        locale,
                                                    )}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImageOff className="size-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <CardContent className="space-y-1 p-3">
                                            <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                                                {t(product.title, locale)}
                                            </h3>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-xs text-muted-foreground line-through">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className="font-semibold text-foreground">
                                                    {formatPrice(
                                                        product.effective_price,
                                                        locale,
                                                    )}{" "}
                                                    {product.currency}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="start-0" />
                    <CarouselNext className="end-0" />
                </Carousel>
            </div>
        </section>
    );
}

function CustomContentSection({ content }) {
    const { locale } = usePage().props;

    const heading = t(content?.heading, locale);
    const body = t(content?.body, locale);

    return (
        <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
            {heading && (
                <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                    {heading}
                </h2>
            )}
            {body && (
                <div
                    className="prose prose-neutral mx-auto max-w-none text-muted-foreground dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: body }}
                />
            )}
        </section>
    );
}
