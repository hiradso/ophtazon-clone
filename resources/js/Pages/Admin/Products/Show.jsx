import { Head, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Pencil, ImageOff, Tag } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { formatPrice, hasDiscount } from "@/lib/pricing";
import { toFa } from "@/lib/toFa";

export default function Show({ product }) {
    const { locale: uiLocale } = usePage().props;
    const discounted = hasDiscount(product.discount_percentage);

    const CONDITION_LABELS = {
        new: at("condition_new", uiLocale),
        used: at("condition_used", uiLocale),
        refurbished: at("condition_refurbished", uiLocale),
    };
    const STATUS_LABELS = {
        draft: at("status_draft", uiLocale),
        pending_review: at("status_pending_review", uiLocale),
        available: at("status_available", uiLocale),
        reserved: at("status_reserved", uiLocale),
        sold: at("status_sold", uiLocale),
        archived: at("status_archived", uiLocale),
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("products", uiLocale),
                    href: route("admin.products.index"),
                },
                { label: product.title?.en ?? product.reference },
            ]}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            nativeButton={false}
                            render={
                                <Link href={route("admin.products.index")} />
                            }
                        >
                            {uiLocale === "fa" ? (
                                <ArrowRight className="size-4" />
                            ) : (
                                <ArrowLeft className="size-4" />
                            )}
                        </Button>
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                            {product.title?.en ?? product.reference}
                        </h2>
                    </div>
                    <Button
                        nativeButton={false}
                        render={
                            <Link
                                href={route("admin.products.edit", product.id)}
                            />
                        }
                    >
                        <Pencil className="me-1.5 size-4" />
                        {at("edit", uiLocale)}
                    </Button>
                </div>
            }
        >
            <Head title={product.title?.en ?? product.reference} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* گالری تصاویر */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {at("product_images", uiLocale)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.images?.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {product.images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="size-24 shrink-0 overflow-hidden rounded-lg border border-border"
                                        >
                                            <img
                                                src={`/storage/${image.url}`}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-24 items-center justify-center text-muted-foreground">
                                    <ImageOff className="size-6" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* اطلاعات پایه */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {at("basic_information", uiLocale)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <InfoRow
                                label={at("reference", uiLocale)}
                                value={product.reference}
                            />
                            <InfoRow
                                label={at("slug", uiLocale)}
                                value={product.slug}
                            />
                            <InfoRow
                                label={`${at("title", uiLocale)} (EN)`}
                                value={product.title?.en || "—"}
                            />
                            <InfoRow
                                label={`${at("title", uiLocale)} (FR)`}
                                value={product.title?.fr || "—"}
                            />
                            <InfoRow
                                label={`${at("title", uiLocale)} (فارسی)`}
                                value={product.title?.fa || "—"}
                                dir="rtl"
                            />
                        </CardContent>
                    </Card>

                    {/* دسته‌بندی */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {at("classification", uiLocale)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-3">
                            <InfoRow
                                label={at("category", uiLocale)}
                                value={product.category?.name?.en ?? "—"}
                            />
                            <InfoRow
                                label={at("brand", uiLocale)}
                                value={product.brand?.name ?? "—"}
                            />
                            <InfoRow
                                label={at("store", uiLocale)}
                                value={product.store?.name ?? "—"}
                            />
                        </CardContent>
                    </Card>

                    {/* قیمت و وضعیت */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {at("pricing_status", uiLocale)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    {at("price", uiLocale)}
                                </p>
                                {discounted ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground line-through">
                                            {formatPrice(
                                                product.price,
                                                uiLocale,
                                            )}
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {formatPrice(
                                                product.effective_price,
                                                uiLocale,
                                            )}{" "}
                                            {product.currency}
                                        </span>
                                        <Badge className="bg-destructive text-white">
                                            <Tag className="me-1 size-3" />
                                            {product.discount_percentage}%
                                        </Badge>
                                    </div>
                                ) : (
                                    <p className="font-medium text-foreground">
                                        {formatPrice(product.price, uiLocale)}{" "}
                                        {product.currency}
                                    </p>
                                )}
                            </div>
                            <InfoRow
                                label={at("stock_quantity", uiLocale)}
                                value={toFa(product.stock_quantity, uiLocale)}
                            />
                            <InfoRow
                                label={at("condition", uiLocale)}
                                value={
                                    CONDITION_LABELS[product.condition] ?? "—"
                                }
                            />
                            <InfoRow
                                label={at("status", uiLocale)}
                                value={STATUS_LABELS[product.status] ?? "—"}
                            />
                            <InfoRow
                                label={at("manufacture_year", uiLocale)}
                                value={
                                    product.manufacture_year
                                        ? toFa(
                                              product.manufacture_year,
                                              uiLocale,
                                          )
                                        : "—"
                                }
                            />
                            <InfoRow
                                label={at("warranty_months", uiLocale)}
                                value={
                                    product.warranty_months > 0
                                        ? toFa(
                                              product.warranty_months,
                                              uiLocale,
                                          )
                                        : "—"
                                }
                            />
                        </CardContent>
                    </Card>

                    {/* کشورهای مجاز */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {at("available_in_countries", uiLocale)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.allowed_countries?.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {product.allowed_countries.map(
                                        (country) => (
                                            <Badge
                                                key={country.id}
                                                variant="outline"
                                            >
                                                {country.name}
                                            </Badge>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {at("sold_everywhere", uiLocale)}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

function InfoRow({ label, value, dir }) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground" dir={dir}>
                {value}
            </p>
        </div>
    );
}
