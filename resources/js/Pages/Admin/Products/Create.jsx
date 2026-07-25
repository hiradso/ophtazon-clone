import { Head, Link, useForm } from "@inertiajs/react";
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
import { ArrowLeft } from "lucide-react";

const CONDITION_LABELS = {
    new: "New",
    used: "Used",
    refurbished: "Refurbished",
};
const STATUS_LABELS = {
    draft: "Draft",
    pending_review: "Pending Review",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    archived: "Archived",
};

export default function Create({ categories, brands, stores }) {
    const { data, setData, post, processing, errors } = useForm({
        reference: "",
        title: { en: "", fr: "" },
        description: { en: "", fr: "" },
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
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.products.store"));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Products", href: route("admin.products.index") },
                { label: "Add Product" },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.products.index")} />}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Add Product
                    </h2>
                </div>
            }
        >
            <Head title="Add Product" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* اطلاعات پایه چندزبانه */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
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
                                    </TabsList>

                                    <TabsContent
                                        value="en"
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <Label htmlFor="title_en">
                                                Title (EN)
                                            </Label>
                                            <Input
                                                id="title_en"
                                                value={data.title.en}
                                                onChange={(e) =>
                                                    setData("title", {
                                                        ...data.title,
                                                        en: e.target.value,
                                                    })
                                                }
                                            />
                                            {errors["title.en"] && (
                                                <p className="text-sm text-destructive">
                                                    {errors["title.en"]}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="description_en">
                                                Description (EN)
                                            </Label>
                                            <Textarea
                                                id="description_en"
                                                rows={4}
                                                value={data.description.en}
                                                onChange={(e) =>
                                                    setData("description", {
                                                        ...data.description,
                                                        en: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="fr"
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <Label htmlFor="title_fr">
                                                Title (FR)
                                            </Label>
                                            <Input
                                                id="title_fr"
                                                value={data.title.fr}
                                                onChange={(e) =>
                                                    setData("title", {
                                                        ...data.title,
                                                        fr: e.target.value,
                                                    })
                                                }
                                            />
                                            {errors["title.fr"] && (
                                                <p className="text-sm text-destructive">
                                                    {errors["title.fr"]}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="description_fr">
                                                Description (FR)
                                            </Label>
                                            <Textarea
                                                id="description_fr"
                                                rows={4}
                                                value={data.description.fr}
                                                onChange={(e) =>
                                                    setData("description", {
                                                        ...data.description,
                                                        fr: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <Separator />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="reference">
                                            Reference
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
                                    <div className="space-y-1.5">
                                        <Label htmlFor="slug">Slug</Label>
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
                                <CardTitle>Classification</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label>Category</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData("category_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {(value) =>
                                                    value
                                                        ? categories.find(
                                                              (c) =>
                                                                  String(
                                                                      c.id,
                                                                  ) === value,
                                                          )?.name.en
                                                        : "Select category"
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                >
                                                    {category.name.en}
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

                                <div className="space-y-1.5">
                                    <Label>Brand</Label>
                                    <Select
                                        value={data.brand_id}
                                        onValueChange={(value) =>
                                            setData("brand_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {(value) =>
                                                    value
                                                        ? brands.find(
                                                              (b) =>
                                                                  String(
                                                                      b.id,
                                                                  ) === value,
                                                          )?.name
                                                        : "No brand"
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
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Store</Label>
                                    <Select
                                        value={data.store_id}
                                        onValueChange={(value) =>
                                            setData("store_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {(value) =>
                                                    value
                                                        ? stores.find(
                                                              (s) =>
                                                                  String(
                                                                      s.id,
                                                                  ) === value,
                                                          )?.name
                                                        : "Select store"
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
                                <CardTitle>Pricing & Status</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="price">Price</Label>
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

                                <div className="space-y-1.5">
                                    <Label htmlFor="currency">Currency</Label>
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

                                <div className="space-y-1.5">
                                    <Label>Condition</Label>
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
                                                        : "Select condition"
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">
                                                New
                                            </SelectItem>
                                            <SelectItem value="used">
                                                Used
                                            </SelectItem>
                                            <SelectItem value="refurbished">
                                                Refurbished
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.condition && (
                                        <p className="text-sm text-destructive">
                                            {errors.condition}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Status</Label>
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
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="pending_review">
                                                Pending Review
                                            </SelectItem>
                                            <SelectItem value="available">
                                                Available
                                            </SelectItem>
                                            <SelectItem value="reserved">
                                                Reserved
                                            </SelectItem>
                                            <SelectItem value="sold">
                                                Sold
                                            </SelectItem>
                                            <SelectItem value="archived">
                                                Archived
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="manufacture_year">
                                        Manufacture Year
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

                                <div className="space-y-1.5">
                                    <Label htmlFor="warranty_months">
                                        Warranty (months)
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
                                        Checked by Ophtazon
                                    </Label>
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
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Save Product"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
