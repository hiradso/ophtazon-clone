import { Head, Link, useForm, usePage } from "@inertiajs/react";
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
import { ArrowLeft, ArrowRight } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { at } from "@/lib/admin-i18n";

export default function Create({ parentOptions }) {
    const { locale: uiLocale } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        parent_id: "",
        name: { en: "", fr: "", fa: "" },
        slug: "",
        icon_url: "",
        sort_order: "0",
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.categories.store"));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("categories", uiLocale),
                    href: route("admin.categories.index"),
                },
                { label: at("add_category_title", uiLocale) },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.categories.index")} />}
                    >
                        {uiLocale === "fa" ? (
                            <ArrowRight className="size-4" />
                        ) : (
                            <ArrowLeft className="size-4" />
                        )}
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {at("add_category_title", uiLocale)}
                    </h2>
                </div>
            }
        >
            <Head title={at("add_category_title", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
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
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`name_${locale}`}
                                                >
                                                    {at("name_field", uiLocale)}{" "}
                                                    {locale !== "en" &&
                                                        at(
                                                            "optional",
                                                            uiLocale,
                                                        )}
                                                </Label>
                                                <Input
                                                    id={`name_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    value={
                                                        data.name[locale] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData("name", {
                                                            ...data.name,
                                                            [locale]:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors[`name.${locale}`] && (
                                                    <p className="text-sm text-destructive">
                                                        {
                                                            errors[
                                                                `name.${locale}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <Separator />

                                <div className="space-y-1.5">
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

                                <div className="space-y-1.5">
                                    <Label>{at("parent", uiLocale)}</Label>
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
                                                        : at(
                                                              "select_parent",
                                                              uiLocale,
                                                          )
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
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="icon_url">
                                        {at("icon_url", uiLocale)}
                                    </Label>
                                    <Input
                                        id="icon_url"
                                        value={data.icon_url}
                                        onChange={(e) =>
                                            setData("icon_url", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="sort_order">
                                        {at("sort_order", uiLocale)}
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

                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData("is_active", checked)
                                        }
                                    />
                                    <Label htmlFor="is_active">
                                        {at("active", uiLocale)}
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
                                        href={route("admin.categories.index")}
                                    />
                                }
                            >
                                {at("cancel", uiLocale)}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? at("saving", uiLocale)
                                    : at("save_changes", uiLocale)}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
