import { useState } from "react";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageOff, X, Bell } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/translate";
import { tt } from "@/lib/i18n";
import { formatPrice, hasDiscount } from "@/lib/pricing";
import { toFa } from "@/lib/toFa";
import SeoAlternateLinks from "@/Components/SeoAlternateLinks";

export default function Index({
    products,
    categories,
    brands,
    stores,
    filters,
}) {
    const { locale, appUrl } = usePage().props;

    const CONDITION_LABELS = {
        new: tt("condition_new", locale),
        used: tt("condition_used", locale),
        refurbished: tt("condition_refurbished", locale),
    };

    const [localFilters, setLocalFilters] = useState({
        category: filters.category ?? "",
        brand: filters.brand ?? "",
        store: filters.store ?? "",
        condition: filters.condition ?? "",
        min_price: filters.min_price ?? "",
        max_price: filters.max_price ?? "",
        q: filters.q ?? "",
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const {
        data: alertData,
        setData: setAlertData,
        post: postAlert,
        processing: alertProcessing,
        errors: alertErrors,
        reset: resetAlert,
    } = useForm({
        email: "",
        category_id: filters.category
            ? (categories.find((c) => c.slug === filters.category)?.id ?? "")
            : "",
        brand_id: filters.brand ?? "",
        max_price: filters.max_price ?? "",
    });

    const applyFilters = (overrides = {}) => {
        const next = { ...localFilters, ...overrides };
        setLocalFilters(next);
        router.get(route("products.index"), next, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const empty = {
            category: "",
            brand: "",
            store: "",
            condition: "",
            min_price: "",
            max_price: "",
            q: "",
        };
        setLocalFilters(empty);
        router.get(route("products.index"), {}, { preserveState: true });
    };

    const hasActiveFilters = Object.values(filters).some((value) => value);

    const submitAlert = (e) => {
        e.preventDefault();
        postAlert(route("alerts.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setAlertOpen(false);
                resetAlert("email");
            },
        });
    };

    return (
        <PublicLayout>
            <Head title="Browse Equipment">
                <SeoAlternateLinks path="/products" />
            </Head>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                    Ophthalmic Equipment
                </h1>

                {/* نوار افقی فیلتر */}
                <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-6">
                    <Select
                        value={localFilters.category}
                        onValueChange={(value) =>
                            applyFilters({ category: value })
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue>
                                {(value) =>
                                    value
                                        ? t(
                                              categories.find(
                                                  (c) => c.slug === value,
                                              )?.name,
                                              locale,
                                          )
                                        : tt("category", locale)
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.slug}
                                >
                                    {t(category.name, locale)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={localFilters.brand}
                        onValueChange={(value) =>
                            applyFilters({ brand: value })
                        }
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue>
                                {(value) =>
                                    value
                                        ? brands.find(
                                              (b) => String(b.id) === value,
                                          )?.name
                                        : tt("brand", locale)
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {brands.map((brand) => (
                                <SelectItem
                                    key={brand.id}
                                    value={String(brand.id)}
                                >
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={localFilters.store}
                        onValueChange={(value) =>
                            applyFilters({ store: value })
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue>
                                {(value) =>
                                    value
                                        ? stores.find(
                                              (s) => String(s.id) === value,
                                          )?.name
                                        : tt("store", locale)
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {stores.map((store) => (
                                <SelectItem
                                    key={store.id}
                                    value={String(store.id)}
                                >
                                    {store.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={localFilters.condition}
                        onValueChange={(value) =>
                            applyFilters({ condition: value })
                        }
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue>
                                {(value) =>
                                    value
                                        ? CONDITION_LABELS[value]
                                        : tt("condition", locale)
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">
                                {tt("condition_new", locale)}
                            </SelectItem>
                            <SelectItem value="used">
                                {tt("condition_used", locale)}
                            </SelectItem>
                            <SelectItem value="refurbished">
                                {tt("condition_refurbished", locale)}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1.5">
                        <Input
                            type="number"
                            placeholder={tt("min_price_short", locale)}
                            className="w-24"
                            value={localFilters.min_price}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    min_price: e.target.value,
                                })
                            }
                            onBlur={() => applyFilters()}
                        />
                        <span className="text-muted-foreground">–</span>
                        <Input
                            type="number"
                            placeholder={tt("max_price_short", locale)}
                            className="w-24"
                            value={localFilters.max_price}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    max_price: e.target.value,
                                })
                            }
                            onBlur={() => applyFilters()}
                        />
                    </div>

                    {hasActiveFilters && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="ms-auto"
                            >
                                <X className="me-1.5 size-3.5" />
                                {tt("clear_filters", locale)}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAlertOpen(true)}
                                className={hasActiveFilters ? "" : "ms-auto"}
                            >
                                <Bell className="me-1.5 size-3.5" />
                                {tt("notify_me", locale)}
                            </Button>
                        </>
                    )}
                </div>

                {/* نتایج */}
                <p className="mb-4 text-sm text-muted-foreground">
                    {toFa(products.total, locale)}{" "}
                    {products.total === 1
                        ? tt("result", locale)
                        : tt("results", locale)}
                </p>

                {products.data.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                        No equipment matches your filters.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.data.map((product, index) => {
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
                                    delay: (index % 8) * 0.05,
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
                                                    {
                                                        product.discount_percentage
                                                    }
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

                {products.links.length > 3 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-1">
                        {products.links.map((link, index) =>
                            link.url ? (
                                <Button
                                    key={index}
                                    nativeButton={false}
                                    render={<Link href={link.url} />}
                                    variant={link.active ? "default" : "ghost"}
                                    size="sm"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>
            <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{tt("get_notified", locale)}</DialogTitle>
                        <DialogDescription>
                            {tt("notify_desc", locale)}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitAlert} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="alert_email">
                                {tt("email", locale)}
                            </Label>
                            <Input
                                id="alert_email"
                                type="email"
                                value={alertData.email}
                                onChange={(e) =>
                                    setAlertData("email", e.target.value)
                                }
                            />
                            {alertErrors.email && (
                                <p className="text-sm text-destructive">
                                    {alertErrors.email}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAlertOpen(false)}
                            >
                                {tt("cancel", locale)}
                            </Button>
                            <Button type="submit" disabled={alertProcessing}>
                                {alertProcessing
                                    ? tt("saving", locale)
                                    : tt("notify_me", locale)}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
