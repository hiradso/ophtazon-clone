import { Head, Link, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageOff, Trash2, ArrowRight } from "lucide-react";
import { t } from "@/lib/translate";

export default function Index({ cart }) {
    const { locale } = usePage().props;
    const items = cart?.items ?? [];

    const removeItem = (cartItemId) => {
        router.delete(route("cart.destroy", cartItemId), {
            preserveScroll: true,
        });
    };

    const total = items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
    );
    const currency = items[0]?.product.currency ?? "EUR";

    return (
        <PublicLayout>
            <Head title="Your Cart" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                    Your Cart
                </h1>

                {items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border py-16 text-center">
                        <p className="mb-4 text-sm text-muted-foreground">
                            Your cart is empty.
                        </p>
                        <Button
                            nativeButton={false}
                            render={<Link href={route("products.index")} />}
                        >
                            Browse equipment
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                            {item.product.images?.[0] ? (
                                                <img
                                                    src={`/storage/${item.product.images[0].url}`}
                                                    alt=""
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
                                                {t(item.product.title, locale)}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">
                                                {item.product.store?.name}
                                            </p>
                                        </div>

                                        <p className="shrink-0 font-semibold text-foreground">
                                            {item.product.price}{" "}
                                            {item.product.currency}
                                        </p>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card>
                            <CardContent className="space-y-4 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span className="text-xl font-semibold text-foreground">
                                        {total.toFixed(2)} {currency}
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
                                                href={route("checkout.index")}
                                            />
                                        }
                                    >
                                        Proceed to checkout
                                        <ArrowRight className="ml-1.5 size-4" />
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
