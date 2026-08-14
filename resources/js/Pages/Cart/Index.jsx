import { Head, Link, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageOff, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { t } from "@/lib/translate";
import { tt } from "@/lib/i18n";
import { formatPrice, hasDiscount } from "@/lib/pricing";
import { useCurrency } from "@/lib/currency-provider";
import Price from "@/Components/Price";

export default function Index({ cart }) {
    const { locale } = usePage().props;
    const items = cart?.items ?? [];
    const { convert } = useCurrency();

    const removeItem = (cartItemId) => {
        router.delete(
            route("cart.destroy", { locale, cartItem: cartItemId }),
            {
                preserveScroll: true,
            },
        );
    };

    // چون آیتم‌های سبد می‌تونن ارزهای مبدأ متفاوت داشته باشن (مثلاً
    // محصولات فروشگاه‌های مختلف)، هر آیتم اول به ارز نمایشی فعلی
    // تبدیل می‌شه و بعد جمع زده می‌شه — نه جمع خام مبالغ ارزهای مختلف.
    const { total, currency } = items.reduce(
        (acc, item) => {
            const converted = convert(
                item.product.effective_price * item.quantity,
                item.product.currency,
            );
            return {
                total: acc.total + converted.amount,
                currency: converted.currency,
            };
        },
        { total: 0, currency: "USD" },
    );

    return (
        <PublicLayout>
            <Head title={tt("your_cart", locale)} />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                    {tt("your_cart", locale)}
                </h1>

                {items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border py-16 text-center">
                        <p className="mb-4 text-sm text-muted-foreground">
                            {tt("cart_empty", locale)}
                        </p>
                        <Button
                            nativeButton={false}
                            render={<Link href={route("products.index", { locale })} />}
                        >
                            {tt("browse_equipment", locale)}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {items.map((item) => {
                                const discounted = hasDiscount(
                                    item.product.discount_percentage,
                                );
                                return (
                                    <Card key={item.id}>
                                        <CardContent className="flex items-center gap-4 p-4">
                                            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                                {item.product.images?.[0] ? (
                                                    <img
                                                        src={`/storage/${item.product.images[0].url}`}
                                                        alt=""
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageOff className="size-6 text-muted-foreground" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={route(
                                                        "products.show",
                                                        item.product.slug,
                                                    )}
                                                    className="font-medium text-foreground hover:underline"
                                                >
                                                    {t(
                                                        item.product.title,
                                                        locale,
                                                    )}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.product.store?.name}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                {discounted && (
                                                    <Price
                                                        amount={
                                                            item.product.price
                                                        }
                                                        currency={
                                                            item.product
                                                                .currency
                                                        }
                                                        locale={locale}
                                                        className="block text-xs text-muted-foreground line-through"
                                                    />
                                                )}
                                                <Price
                                                    amount={
                                                        item.product
                                                            .effective_price
                                                    }
                                                    currency={
                                                        item.product.currency
                                                    }
                                                    locale={locale}
                                                    className="font-semibold text-foreground"
                                                />
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <Card>
                            <CardContent className="space-y-4 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {tt("subtotal", locale)}
                                    </span>
                                    <span className="text-xl font-semibold text-foreground">
                                        {formatPrice(total, locale)} {currency}
                                    </span>
                                </div>

                                <Separator />

                                <motion.div whileTap={{ scale: 0.97 }}>
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={route("checkout.index", { locale })}
                                            />
                                        }
                                    >
                                        {tt("proceed_to_checkout", locale)}
                                        {locale === "fa" ? (
                                            <ArrowLeft className="me-1.5 size-4" />
                                        ) : (
                                            <ArrowRight className="ms-1.5 size-4" />
                                        )}
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
