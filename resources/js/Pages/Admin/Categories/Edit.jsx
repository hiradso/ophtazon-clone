import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function Edit({ category, parentOptions }) {
    const { data, setData, put, processing, errors } = useForm({
        parent_id: category.parent_id ? String(category.parent_id) : "",
        name: { en: category.name?.en ?? "", fr: category.name?.fr ?? "" },
        slug: category.slug ?? "",
        icon_url: category.icon_url ?? "",
        sort_order: category.sort_order ?? "0",
        is_active: category.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.categories.update", category.id));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Categories", href: route("admin.categories.index") },
                { label: category.name?.en },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.categories.index")} />}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Edit Category
                    </h2>
                </div>
            }
        >
            <Head title={`Edit — ${category.name?.en}`} />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Details</CardTitle>
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

                                    <TabsContent value="en">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name_en">
                                                Name (EN)
                                            </Label>
                                            <Input
                                                id="name_en"
                                                value={data.name.en}
                                                onChange={(e) =>
                                                    setData("name", {
                                                        ...data.name,
                                                        en: e.target.value,
                                                    })
                                                }
                                            />
                                            {errors["name.en"] && (
                                                <p className="text-sm text-destructive">
                                                    {errors["name.en"]}
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="fr">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name_fr">
                                                Name (FR)
                                            </Label>
                                            <Input
                                                id="name_fr"
                                                value={data.name.fr}
                                                onChange={(e) =>
                                                    setData("name", {
                                                        ...data.name,
                                                        fr: e.target.value,
                                                    })
                                                }
                                            />
                                            {errors["name.fr"] && (
                                                <p className="text-sm text-destructive">
                                                    {errors["name.fr"]}
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <Separator />

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

                                <div className="space-y-1.5">
                                    <Label>Parent Category</Label>
                                    <Select
                                        value={data.parent_id}
                                        onValueChange={(value) =>
                                            setData("parent_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    value
                                                        ? parentOptions.find(
                                                              (p) =>
                                                                  String(
                                                                      p.id,
                                                                  ) === value,
                                                          )?.name.en
                                                        : "None (top-level category)"
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parentOptions.map((parent) => (
                                                <SelectItem
                                                    key={parent.id}
                                                    value={String(parent.id)}
                                                >
                                                    {parent.name.en}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.parent_id}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="icon_url">
                                            Icon URL
                                        </Label>
                                        <Input
                                            id="icon_url"
                                            value={data.icon_url}
                                            onChange={(e) =>
                                                setData(
                                                    "icon_url",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="sort_order">
                                            Sort Order
                                        </Label>
                                        <Input
                                            id="sort_order"
                                            type="number"
                                            value={data.sort_order}
                                            onChange={(e) =>
                                                setData(
                                                    "sort_order",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData("is_active", checked)
                                        }
                                    />
                                    <Label htmlFor="is_active">Active</Label>
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
                                        href={route("admin.categories.index")}
                                    />
                                }
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
