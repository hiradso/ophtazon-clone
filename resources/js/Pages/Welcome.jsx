import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ImageOff, ArrowRight } from "lucide-react";

const CONDITION_LABELS = {
    new: "New",
    used: "Used",
    refurbished: "Refurbished",
};

export default function Welcome({ categories, latestProducts }) {
    return (
        <PublicLayout>
            <Head title="Ophtazon — Ophthalmic Equipment Marketplace" />

            {/* Hero */}
            <section className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        New &amp; used ophthalmic equipment,
                        <br className="hidden sm:block" />
                        trusted worldwide.
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Buy and sell slit lamps, OCT machines, autorefractors
                        and more — checked, catalogued and shipped by our
                        regional teams.
                    </p>
                    <div className="mt-8 flex justify-center gap-3">
                        <Button
                            size="lg"
                            nativeButton={false}
                            render={<Link href={route("products.index")} />}
                        >
                            Browse equipment
                            <ArrowRight className="ml-1.5 size-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* دسته‌بندی‌ها */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
                        Shop by category
                    </h2>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={route("products.index", {
                                    category: category.slug,
                                })}
                            >
                                <Card className="h-full transition-shadow hover:shadow-md">
                                    <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                                        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Eye className="size-6" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">
                                            {category.name.en}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* جدیدترین آگهی‌ها */}
            {latestProducts.length > 0 && (
                <section className="border-t border-border bg-card">
                    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                Latest listings
                            </h2>
                            <Link
                                href={route("products.index")}
                                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                            >
                                View all
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {latestProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={route("products.show", product.slug)}
                                >
                                    <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
                                        <div className="flex aspect-square items-center justify-center bg-muted">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={`/storage/${product.images[0].url}`}
                                                    alt={product.title.en}
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
                                                {product.title.en}
                                            </h3>
                                            <p className="text-lg font-semibold text-foreground">
                                                {product.price}{" "}
                                                {product.currency}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
