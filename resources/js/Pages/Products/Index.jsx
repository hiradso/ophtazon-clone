import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
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
import { ImageOff, X } from "lucide-react";

const CONDITION_LABELS = {
    new: "New",
    used: "Used",
    refurbished: "Refurbished",
};

export default function Index({
    products,
    categories,
    brands,
    stores,
    filters,
}) {
    const [localFilters, setLocalFilters] = useState({
        category: filters.category ?? "",
        brand: filters.brand ?? "",
        store: filters.store ?? "",
        condition: filters.condition ?? "",
        min_price: filters.min_price ?? "",
        max_price: filters.max_price ?? "",
        q: filters.q ?? "",
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

    return (
        <PublicLayout>
            <Head title="Browse Equipment" />

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
                                        ? categories.find(
                                              (c) => c.slug === value,
                                          )?.name.en
                                        : "Category"
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.slug}
                                >
                                    {category.name.en}
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
                                        : "Brand"
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
                                        : "Store"
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
                                        : "Condition"
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                            <SelectItem value="refurbished">
                                Refurbished
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1.5">
                        <Input
                            type="number"
                            placeholder="Min €"
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
                            placeholder="Max €"
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="ml-auto"
                        >
                            <X className="mr-1.5 size-3.5" />
                            Clear filters
                        </Button>
                    )}
                </div>

                {/* نتایج */}
                <p className="mb-4 text-sm text-muted-foreground">
                    {products.total}{" "}
                    {products.total === 1 ? "result" : "results"}
                </p>

                {products.data.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                        No equipment matches your filters.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.data.map((product) => (
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
        </PublicLayout>
    );
}
