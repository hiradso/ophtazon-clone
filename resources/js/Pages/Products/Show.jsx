import { useState } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import {
    ArrowLeft,
    ArrowRight,
    ImageOff,
    MapPin,
    ShieldCheck,
    Flame,
} from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { t } from "@/lib/translate";
import { tt } from "@/lib/i18n";
import { formatPrice, hasDiscount } from "@/lib/pricing";
import { toFa } from "@/lib/toFa";

const CONDITION_LABELS = {
    new: "New",
    used: "Used",
    refurbished: "Refurbished",
};

const LOW_STOCK_THRESHOLD = 5;

export default function Show({ product, relatedProducts }) {
    const { locale } = usePage().props;

    const images = product.images ?? [];
    const [activeImage, setActiveImage] = useState(images[0] ?? null);
    const [contactOpen, setContactOpen] = useState(false);

    const productTitle = t(product.title, locale);
    const productDescription = t(product.description, locale);
    const categoryName = t(product.category?.name, locale);

    const stock = product.stock_quantity ?? 1;
    const isLowStock = stock > 0 && stock <= LOW_STOCK_THRESHOLD;
    const discounted = hasDiscount(product.discount_percentage);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: "quote_request",
        name: "",
        email: "",
        phone: "",
        message: "",
        product_id: product.id,
        store_id: product.store?.id ?? null,
    });

    const submitContact = (e) => {
        e.preventDefault();
        post(route("contact-requests.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setContactOpen(false);
                reset("name", "email", "phone", "message");
            },
        });
    };

    return (
        <PublicLayout>
            <Head
                title={
                    t(product.meta_title, locale) ||
                    productTitle ||
                    product.reference
                }
            >
                <meta
                    name="description"
                    content={
                        t(product.meta_description, locale) ||
                        productDescription?.slice(0, 160) ||
                        ""
                    }
                />

                {/* Canonical — همیشه به آدرس اصلی (با پیشوند زبان فعلی) و بدون پارامتر اضافه اشاره می‌کند */}
                <link
                    rel="canonical"
                    href={`${window.location.origin}/${locale}/products/${product.slug}`}
                />
                {/* Hreflang — به گوگل می‌گوید این صفحه به کدام زبان‌های دیگر هم ترجمه شده است */}
                <link
                    rel="alternate"
                    hrefLang="en"
                    href={`${window.location.origin}/en/products/${product.slug}`}
                />
                <link
                    rel="alternate"
                    hrefLang="fr"
                    href={`${window.location.origin}/fr/products/${product.slug}`}
                />
                <link
                    rel="alternate"
                    hrefLang="fa"
                    href={`${window.location.origin}/fa/products/${product.slug}`}
                />
                <link
                    rel="alternate"
                    hrefLang="x-default"
                    href={`${window.location.origin}/en/products/${product.slug}`}
                />

                {/* Open Graph — برای اشتراک‌گذاری در شبکه‌های اجتماعی */}
                <meta property="og:type" content="product" />
                <meta
                    property="og:title"
                    content={t(product.meta_title, locale) || productTitle}
                />
                <meta
                    property="og:description"
                    content={
                        t(product.meta_description, locale) ||
                        productDescription?.slice(0, 160) ||
                        ""
                    }
                />
                <meta
                    property="og:url"
                    content={`${window.location.origin}/products/${product.slug}`}
                />
                {(product.og_image || product.images?.[0]?.url) && (
                    <meta
                        property="og:image"
                        content={`${window.location.origin}/storage/${product.og_image || product.images[0].url}`}
                    />
                )}

                {/* داده‌ی ساختاریافته — برای نمایش قیمت/موجودی مستقیم در نتایج گوگل */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: productTitle,
                        description: productDescription || "",
                        image: product.images?.[0]
                            ? `${window.location.origin}/storage/${product.images[0].url}`
                            : undefined,
                        sku: product.reference,
                        offers: {
                            "@type": "Offer",
                            url: `${window.location.origin}/products/${product.slug}`,
                            priceCurrency: product.currency,
                            price: product.effective_price,
                            availability:
                                product.stock_quantity > 0
                                    ? "https://schema.org/InStock"
                                    : "https://schema.org/OutOfStock",
                            itemCondition:
                                product.condition === "new"
                                    ? "https://schema.org/NewCondition"
                                    : "https://schema.org/UsedCondition",
                        },
                    })}
                </script>
            </Head>

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={route("products.index")} />}
                    className="mb-6"
                >
                    {locale === "fa" ? (
                        <ArrowRight className="me-1.5 size-4" />
                    ) : (
                        <ArrowLeft className="me-1.5 size-4" />
                    )}
                    {tt("back_to_results", locale)}
                </Button>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[28rem_1fr] lg:gap-12">
                    {/* گالری تصاویر */}
                    <div className="relative self-start">
                        {discounted && (
                            <div
                                dir="ltr"
                                className="absolute top-3 start-3 z-10 rounded-md bg-destructive px-2.5 py-1 text-sm font-semibold text-white shadow-md"
                            >
                                -{toFa(product.discount_percentage, locale)}%
                            </div>
                        )}
                        <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                            {activeImage ? (
                                <img
                                    src={`/storage/${activeImage.url}`}
                                    alt={productTitle}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <ImageOff className="size-12 text-muted-foreground" />
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="mt-3 flex gap-2">
                                {images.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setActiveImage(image)}
                                        className={`size-16 overflow-hidden rounded-md border-2 transition-colors ${
                                            activeImage?.id === image.id
                                                ? "border-primary"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${image.url}`}
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* جزئیات */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline">
                                {CONDITION_LABELS[product.condition]}
                            </Badge>
                            {product.is_checked && (
                                <Badge
                                    variant="outline"
                                    className="bg-status-available/15 text-status-available border-status-available/30"
                                >
                                    <ShieldCheck className="me-1 size-3" />
                                    Checked by Ophtazon
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            {productTitle}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Ref: {product.reference}
                        </p>

                        <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
                            {discounted && (
                                <span className="text-lg text-muted-foreground line-through">
                                    {formatPrice(product.price, locale)}{" "}
                                    {product.currency}
                                </span>
                            )}
                            <span className="text-3xl font-bold text-foreground">
                                {formatPrice(product.effective_price, locale)}{" "}
                                {product.currency}
                            </span>
                            {discounted && (
                                <Badge
                                    dir="ltr"
                                    className="bg-destructive text-white"
                                >
                                    -{toFa(product.discount_percentage, locale)}
                                    %
                                </Badge>
                            )}
                        </div>

                        {isLowStock && (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-status-pending/15 px-2.5 py-1 text-sm font-medium text-status-pending">
                                <Flame className="size-3.5" />
                                {stock === 1
                                    ? tt("last_one_available", locale)
                                    : `${tt("low_stock_prefix", locale)} ${stock} ${tt("low_stock_suffix", locale)}`}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <motion.div
                                whileTap={{ scale: 0.96 }}
                                className="inline-block"
                            >
                                <Button
                                    variant="default"
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                        router.post(
                                            route("cart.store"),
                                            { product_id: product.id },
                                            {
                                                preserveScroll: true,
                                            },
                                        );
                                    }}
                                >
                                    <ShoppingCart className="me-1.5 size-4" />
                                    {tt("add_to_cart", locale)}
                                </Button>
                            </motion.div>

                            <motion.div
                                whileTap={{ scale: 0.96 }}
                                className="inline-block"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={() => setContactOpen(true)}
                                >
                                    {tt("contact_seller", locale)}
                                </Button>
                            </motion.div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">
                                    Category
                                </p>
                                <p className="font-medium text-foreground">
                                    {categoryName || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Brand</p>
                                <p className="font-medium text-foreground">
                                    {product.brand?.name ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Manufacture year
                                </p>
                                <p className="font-medium text-foreground">
                                    {product.manufacture_year
                                        ? toFa(product.manufacture_year, locale)
                                        : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    {tt("warranty", locale)}
                                </p>
                                <p className="font-medium text-foreground">
                                    {product.warranty_months > 0
                                        ? `${toFa(product.warranty_months, locale)} ${tt("months_suffix", locale)}`
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                    <MapPin className="size-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">
                                        {product.store?.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {product.store?.country?.name}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {productDescription && (
                    <div className="mt-10 max-w-3xl">
                        <h2 className="mb-3 text-lg font-semibold text-foreground">
                            Description
                        </h2>
                        <p className="whitespace-pre-line text-muted-foreground">
                            {productDescription}
                        </p>
                    </div>
                )}

                {/* محصولات مرتبط */}
                {relatedProducts?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            Related Equipment
                        </h2>

                        <Carousel
                            dir={locale === "fa" ? "rtl" : "ltr"}
                            opts={{
                                align: "start",
                                direction: locale === "fa" ? "rtl" : "ltr",
                            }}
                            className="px-10"
                        >
                            <CarouselContent>
                                {relatedProducts.map((related) => (
                                    <CarouselItem
                                        key={related.id}
                                        className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
                                    >
                                        <Link
                                            href={route(
                                                "products.show",
                                                related.slug,
                                            )}
                                        >
                                            <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
                                                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-muted">
                                                    {hasDiscount(
                                                        related.discount_percentage,
                                                    ) && (
                                                        <div
                                                            dir="ltr"
                                                            className="absolute top-2 start-2 z-10 rounded bg-destructive px-1.5 py-0.5 text-xs font-semibold text-white shadow"
                                                        >
                                                            -
                                                            {toFa(
                                                                related.discount_percentage,
                                                                locale,
                                                            )}
                                                            %
                                                        </div>
                                                    )}
                                                    {related.images?.[0] ? (
                                                        <motion.img
                                                            whileHover={{
                                                                scale: 1.08,
                                                            }}
                                                            transition={{
                                                                duration: 0.4,
                                                            }}
                                                            loading="lazy"
                                                            src={`/storage/${related.images[0].url}`}
                                                            alt={t(
                                                                related.title,
                                                                locale,
                                                            )}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageOff className="size-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <CardContent className="space-y-1 p-3">
                                                    <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                                                        {t(
                                                            related.title,
                                                            locale,
                                                        )}
                                                    </h3>
                                                    <p className="font-semibold text-foreground">
                                                        {formatPrice(
                                                            related.effective_price,
                                                            locale,
                                                        )}{" "}
                                                        {related.currency}
                                                    </p>
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
                )}
            </div>

            {/* Dialog تماس با فروشنده */}
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {tt("contact_seller", locale)}
                        </DialogTitle>
                        <DialogDescription>
                            {tt("ask_about", locale)} "{productTitle}".{" "}
                            {tt("contact_seller_desc", locale)}{" "}
                            {product.store?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitContact} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="contact_name">
                                {tt("your_name", locale)}
                            </Label>
                            <Input
                                id="contact_name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contact_email">
                                {tt("email", locale)}
                            </Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contact_phone">
                                {tt("phone_optional", locale)}
                            </Label>
                            <Input
                                id="contact_phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contact_message">
                                {tt("message_optional", locale)}
                            </Label>
                            <Textarea
                                id="contact_message"
                                rows={3}
                                value={data.message}
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setContactOpen(false)}
                            >
                                {tt("cancel", locale)}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? tt("sending_message", locale)
                                    : tt("send_message", locale)}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
