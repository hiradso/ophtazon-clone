import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { getDiscountedPrice, hasDiscount, formatPrice } from "@/lib/pricing";
import MediaPicker from "@/Components/MediaPicker";
import { at } from "@/lib/admin-i18n";

const LOCALE_LABELS = {
    en: "English",
    fr: "Français",
    fa: "فارسی",
};

export default function Create({ categories, brands, stores }) {
    const { locale: uiLocale } = usePage().props;

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

    const { data, setData, post, processing, errors } = useForm({
        reference: "",
        title: { en: "", fr: "", fa: "" },
        description: { en: "", fr: "", fa: "" },
        slug: "",
        category_id: "",
        brand_id: "",
        store_id: "",
        condition: "",
        status: "draft",
        price: "",
        currency: "EUR",
        manufacture_year: "",
        warranty_months: "0",
        is_checked: false,
        stock_quantity: 1,
        discount_percentage: "",
        meta_title: { en: "", fr: "", fa: "" },
        meta_description: { en: "", fr: "", fa: "" },
        og_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.products.store"));
    };

    const discountPreviewActive = hasDiscount(Number(data.discount_percentage));
    const previewFinalPrice = discountPreviewActive
        ? getDiscountedPrice(data.price || 0, Number(data.discount_percentage))
        : null;

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("products", uiLocale),
                    href: route("admin.products.index"),
                },
                { label: at("add_product", uiLocale) },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.products.index")} />}
                    >
                        {uiLocale === "fa" ? (
                            <ArrowRight className="size-4" />
                        ) : (
                            <ArrowLeft className="size-4" />
                        )}
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {at("add_product", uiLocale)}
                    </h2>
                </div>
            }
        >
            <Head title={at("add_product", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* اطلاعات پایه چندزبانه */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("basic_information", uiLocale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Tabs defaultValue="en">
                                    <TabsList>
                                        <TabsTrigger value="en">
                                            English
                                        </TabsTrigger>
                                        <TabsTrigger value="fr">
                                            Français
                                        </TabsTrigger>
                                        <TabsTrigger value="fa">
                                            فارسی
                                        </TabsTrigger>
                                    </TabsList>

                                    {["en", "fr", "fa"].map((locale) => (
                                        <TabsContent
                                            key={locale}
                                            value={locale}
                                            className="space-y-4"
                                            dir={
                                                locale === "fa" ? "rtl" : "ltr"
                                            }
                                        >
                                            <div className="space-y-2.5">
                                                <Label
                                                    htmlFor={`title_${locale}`}
                                                >
                                                    {at("title", uiLocale)} (
                                                    {LOCALE_LABELS[locale]})
                                                </Label>
                                                <Input
                                                    id={`title_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    value={
                                                        data.title[locale] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData("title", {
                                                            ...data.title,
                                                            [locale]:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors[`title.${locale}`] && (
                                                    <p className="text-sm text-destructive">
                                                        {
                                                            errors[
                                                                `title.${locale}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label
                                                    htmlFor={`description_${locale}`}
                                                >
                                                    {at(
                                                        "description",
                                                        uiLocale,
                                                    )}{" "}
                                                    ({LOCALE_LABELS[locale]})
                                                </Label>
                                                <Textarea
                                                    id={`description_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    rows={4}
                                                    value={
                                                        data.description[
                                                            locale
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData("description", {
                                                            ...data.description,
                                                            [locale]:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <Separator />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="reference">
                                            {at("reference", uiLocale)}
                                        </Label>
                                        <Input
                                            id="reference"
                                            value={data.reference}
                                            onChange={(e) =>
                                                setData(
                                                    "reference",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.reference && (
                                            <p className="text-sm text-destructive">
                                                {errors.reference}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label htmlFor="slug">
                                            {at("slug", uiLocale)}
                                        </Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData("slug", e.target.value)
                                            }
                                        />
                                        {errors.slug && (
                                            <p className="text-sm text-destructive">
                                                {errors.slug}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* دسته‌بندی و مکان */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("classification", uiLocale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2.5">
                                    <Label>{at("category", uiLocale)}</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData("category_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    value ? (
                                                        <span
                                                            dir="ltr"
                                                            className="block text-start"
                                                        >
                                                            {
                                                                categories.find(
                                                                    (c) =>
                                                                        String(
                                                                            c.id,
                                                                        ) ===
                                                                        value,
                                                                )?.name.en
                                                            }
                                                        </span>
                                                    ) : (
                                                        at(
                                                            "select_category",
                                                            uiLocale,
                                                        )
                                                    )
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                >
                                                    <span dir="ltr">
                                                        {category.name.en}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <Label>{at("brand", uiLocale)}</Label>
                                    <Select
                                        value={data.brand_id}
                                        onValueChange={(value) =>
                                            setData("brand_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    value ? (
                                                        <span
                                                            dir="ltr"
                                                            className="block text-start"
                                                        >
                                                            {
                                                                brands.find(
                                                                    (c) =>
                                                                        String(
                                                                            c.id,
                                                                        ) ===
                                                                        value,
                                                                )?.name.en
                                                            }
                                                        </span>
                                                    ) : (
                                                        at("no_brand", uiLocale)
                                                    )
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem
                                                    key={brand.id}
                                                    value={String(brand.id)}
                                                >
                                                    <span dir="ltr">
                                                        {brand.name}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2.5">
                                    <Label>{at("store", uiLocale)}</Label>
                                    <Select
                                        value={data.store_id}
                                        onValueChange={(value) =>
                                            setData("store_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    value ? (
                                                        <span
                                                            dir="ltr"
                                                            className="block text-start"
                                                        >
                                                            {
                                                                stores.find(
                                                                    (c) =>
                                                                        String(
                                                                            c.id,
                                                                        ) ===
                                                                        value,
                                                                )?.name.en
                                                            }
                                                        </span>
                                                    ) : (
                                                        at(
                                                            "select_store",
                                                            uiLocale,
                                                        )
                                                    )
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stores.map((store) => (
                                                <SelectItem
                                                    key={store.id}
                                                    value={String(store.id)}
                                                >
                                                    <span dir="ltr">
                                                        {store.name}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.store_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.store_id}
                                        </p>
                                    )}
                                </div>
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
                                <div className="space-y-2.5">
                                    <Label htmlFor="stock_quantity">
                                        {at("stock_quantity", uiLocale)}
                                    </Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min="1"
                                        value={data.stock_quantity}
                                        onChange={(e) =>
                                            setData(
                                                "stock_quantity",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {at("stock_quantity_hint", uiLocale)}
                                    </p>
                                    {errors.stock_quantity && (
                                        <p className="text-sm text-destructive">
                                            {errors.stock_quantity}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="price">
                                        {at("price", uiLocale)}
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-destructive">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="currency">
                                        {at("currency", uiLocale)}
                                    </Label>
                                    <Input
                                        id="currency"
                                        maxLength={3}
                                        value={data.currency}
                                        onChange={(e) =>
                                            setData(
                                                "currency",
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2.5 sm:col-span-2">
                                    <Label htmlFor="discount_percentage">
                                        {at("discount_percentage", uiLocale)}
                                    </Label>
                                    <Input
                                        id="discount_percentage"
                                        type="number"
                                        min="1"
                                        max="99"
                                        placeholder="e.g. 20"
                                        value={data.discount_percentage}
                                        onChange={(e) =>
                                            setData(
                                                "discount_percentage",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {at(
                                            "discount_percentage_hint",
                                            uiLocale,
                                        )}
                                    </p>
                                    {errors.discount_percentage && (
                                        <p className="text-sm text-destructive">
                                            {errors.discount_percentage}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <Label>{at("final_price", uiLocale)}</Label>
                                    <div className="flex h-9 items-center rounded-md border border-dashed border-border bg-muted/40 px-3 text-sm">
                                        {discountPreviewActive ? (
                                            <span className="flex items-center gap-1.5 font-semibold text-foreground">
                                                <Tag className="size-3.5 text-destructive" />
                                                {formatPrice(
                                                    previewFinalPrice,
                                                    uiLocale,
                                                )}{" "}
                                                {data.currency}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                {formatPrice(
                                                    data.price || 0,
                                                    uiLocale,
                                                )}{" "}
                                                {data.currency}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <Label>{at("condition", uiLocale)}</Label>
                                    <Select
                                        value={data.condition}
                                        onValueChange={(value) =>
                                            setData("condition", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {(value) =>
                                                    value
                                                        ? CONDITION_LABELS[
                                                              value
                                                          ]
                                                        : at(
                                                              "select_condition",
                                                              uiLocale,
                                                          )
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">
                                                {at("condition_new", uiLocale)}
                                            </SelectItem>
                                            <SelectItem value="used">
                                                {at("condition_used", uiLocale)}
                                            </SelectItem>
                                            <SelectItem value="refurbished">
                                                {at(
                                                    "condition_refurbished",
                                                    uiLocale,
                                                )}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.condition && (
                                        <p className="text-sm text-destructive">
                                            {errors.condition}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <Label>{at("status", uiLocale)}</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData("status", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {(value) =>
                                                    STATUS_LABELS[value]
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">
                                                {at("status_draft", uiLocale)}
                                            </SelectItem>
                                            <SelectItem value="pending_review">
                                                {at(
                                                    "status_pending_review",
                                                    uiLocale,
                                                )}
                                            </SelectItem>
                                            <SelectItem value="available">
                                                {at(
                                                    "status_available",
                                                    uiLocale,
                                                )}
                                            </SelectItem>
                                            <SelectItem value="reserved">
                                                {at(
                                                    "status_reserved",
                                                    uiLocale,
                                                )}
                                            </SelectItem>
                                            <SelectItem value="sold">
                                                {at("status_sold", uiLocale)}
                                            </SelectItem>
                                            <SelectItem value="archived">
                                                {at(
                                                    "status_archived",
                                                    uiLocale,
                                                )}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="manufacture_year">
                                        {at("manufacture_year", uiLocale)}
                                    </Label>
                                    <Input
                                        id="manufacture_year"
                                        type="number"
                                        value={data.manufacture_year}
                                        onChange={(e) =>
                                            setData(
                                                "manufacture_year",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="warranty_months">
                                        {at("warranty_months", uiLocale)}
                                    </Label>
                                    <Input
                                        id="warranty_months"
                                        type="number"
                                        value={data.warranty_months}
                                        onChange={(e) =>
                                            setData(
                                                "warranty_months",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-6">
                                    <Switch
                                        id="is_checked"
                                        checked={data.is_checked}
                                        onCheckedChange={(checked) =>
                                            setData("is_checked", checked)
                                        }
                                    />
                                    <Label htmlFor="is_checked">
                                        {at("checked_by_ophtazon", uiLocale)}
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{at("seo", uiLocale)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Tabs defaultValue="en">
                                    <TabsList>
                                        <TabsTrigger value="en">
                                            English
                                        </TabsTrigger>
                                        <TabsTrigger value="fr">
                                            Français
                                        </TabsTrigger>
                                        <TabsTrigger value="fa">
                                            فارسی
                                        </TabsTrigger>
                                    </TabsList>

                                    {["en", "fr", "fa"].map((locale) => (
                                        <TabsContent
                                            key={locale}
                                            value={locale}
                                            className="space-y-4"
                                            dir={
                                                locale === "fa" ? "rtl" : "ltr"
                                            }
                                        >
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor={`meta_title_${locale}`}
                                                    >
                                                        {at(
                                                            "meta_title",
                                                            uiLocale,
                                                        )}
                                                    </Label>
                                                    <span
                                                        className={`text-xs ${
                                                            (data.meta_title[
                                                                locale
                                                            ]?.length ?? 0) > 60
                                                                ? "text-destructive"
                                                                : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {data.meta_title[locale]
                                                            ?.length ?? 0}
                                                        /60
                                                    </span>
                                                </div>
                                                <Input
                                                    id={`meta_title_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    value={
                                                        data.meta_title[
                                                            locale
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData("meta_title", {
                                                            ...data.meta_title,
                                                            [locale]:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder={at(
                                                        "leave_empty_hint",
                                                        uiLocale,
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor={`meta_description_${locale}`}
                                                    >
                                                        {at(
                                                            "meta_description",
                                                            uiLocale,
                                                        )}
                                                    </Label>
                                                    <span
                                                        className={`text-xs ${
                                                            (data
                                                                .meta_description[
                                                                locale
                                                            ]?.length ?? 0) >
                                                            160
                                                                ? "text-destructive"
                                                                : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {data.meta_description[
                                                            locale
                                                        ]?.length ?? 0}
                                                        /160
                                                    </span>
                                                </div>
                                                <Textarea
                                                    id={`meta_description_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    rows={2}
                                                    value={
                                                        data.meta_description[
                                                            locale
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "meta_description",
                                                            {
                                                                ...data.meta_description,
                                                                [locale]:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                />
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <div className="space-y-2.5">
                                    <Label>
                                        {at("social_share_image", uiLocale)}
                                    </Label>
                                    <MediaPicker
                                        value={data.og_image}
                                        onSelect={(path) =>
                                            setData("og_image", path)
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {at(
                                            "social_share_image_hint",
                                            uiLocale,
                                        )}
                                    </p>
                                    {errors.og_image && (
                                        <p className="text-sm text-destructive">
                                            {errors.og_image}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                nativeButton={false}
                                render={
                                    <Link
                                        href={route("admin.products.index")}
                                    />
                                }
                            >
                                {at("cancel", uiLocale)}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? at("saving", uiLocale)
                                    : at("save_product", uiLocale)}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
