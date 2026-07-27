import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Eye,
    ImageOff,
    ArrowRight,
    Search,
    ShieldCheck,
    Globe2,
    Truck,
} from "lucide-react";

const CONDITION_LABELS = {
    new: "New",
    used: "Used",
    refurbished: "Refurbished",
};

export default function Welcome({ sections, categories, latestProducts }) {
    return (
        <PublicLayout>
            <Head title="Ophtazon — Ophthalmic Equipment Marketplace" />

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
    return (
        <section className="relative overflow-hidden bg-primary">
            <div
                className="absolute inset-0 opacity-15"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 20%, white 0%, transparent 35%), radial-gradient(circle at 85% 60%, white 0%, transparent 40%)",
                }}
            />

            <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
                <Badge
                    variant="outline"
                    className="mb-5 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                >
                    Trusted by clinics in 5 countries
                </Badge>

                <h1 className="text-3xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
                    {content?.title || "New & used ophthalmic equipment"}
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
                    {content?.subtitle || ""}
                </p>

                <form
                    action={route("products.index")}
                    method="get"
                    className="relative mx-auto mt-8 max-w-lg"
                >
                    <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        name="q"
                        placeholder="Search for an OCT, slit lamp, autorefractor..."
                        className="h-12 w-full rounded-full border-0 bg-background pl-11 pr-32 text-sm text-foreground shadow-lg placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/40"
                    />
                    <Button
                        type="submit"
                        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full bg-foreground text-background hover:bg-foreground/80"
                        size="sm"
                    >
                        Search
                    </Button>
                </form>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/80">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="size-4" />
                        Quality checked
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Globe2 className="size-4" />5 regional showrooms
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Truck className="size-4" />
                        International shipping
                    </div>
                </div>
            </div>
        </section>
    );
}

function CategoriesSection({ categories }) {
    if (categories.length === 0) return null;

    return (
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
                        <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                                <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
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
    );
}

function LatestProductsSection({ products }) {
    if (products.length === 0) return null;

    return (
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
                    {products.map((product) => (
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
                                        {product.price} {product.currency}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CustomContentSection({ content }) {
    return (
        <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
            {content?.heading && (
                <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                    {content.heading}
                </h2>
            )}
            {content?.body && (
                <p className="whitespace-pre-line text-muted-foreground">
                    {content.body}
                </p>
            )}
        </section>
    );
}
