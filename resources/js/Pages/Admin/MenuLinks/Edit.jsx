import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { at } from "@/lib/admin-i18n";

export default function Edit({ menuLink }) {
    const { locale: uiLocale } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        location: menuLink.location ?? "footer",
        group_label: {
            en: menuLink.group_label?.en ?? "",
            fr: menuLink.group_label?.fr ?? "",
            fa: menuLink.group_label?.fa ?? "",
        },
        label: {
            en: menuLink.label?.en ?? "",
            fr: menuLink.label?.fr ?? "",
            fa: menuLink.label?.fa ?? "",
        },
        url: menuLink.url ?? "",
        sort_order: menuLink.sort_order ?? "0",
        is_active: menuLink.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.menu-links.update", menuLink.id));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("menu_links", uiLocale),
                    href: route("admin.menu-links.index"),
                },
                { label: menuLink.label?.en ?? "" },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.menu-links.index")} />}
                    >
                        {uiLocale === "fa" ? (
                            <ArrowRight className="size-4" />
                        ) : (
                            <ArrowLeft className="size-4" />
                        )}
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {at("edit_menu_link", uiLocale)}
                    </h2>
                </div>
            }
        >
            <Head
                title={`${at("edit", uiLocale)} — ${menuLink.label?.en ?? ""}`}
            />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("link_details", uiLocale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>{at("location", uiLocale)}</Label>
                                    <Select
                                        value={data.location}
                                        onValueChange={(value) =>
                                            setData("location", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    value === "header"
                                                        ? at(
                                                              "top_navigation",
                                                              uiLocale,
                                                          )
                                                        : at("footer", uiLocale)
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="header">
                                                {at("top_navigation", uiLocale)}
                                            </SelectItem>
                                            <SelectItem value="footer">
                                                {at("footer", uiLocale)}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

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
                                            {data.location === "footer" && (
                                                <div className="space-y-1.5">
                                                    <Label
                                                        htmlFor={`group_label_${locale}`}
                                                    >
                                                        {at(
                                                            "footer_column",
                                                            uiLocale,
                                                        )}{" "}
                                                        {locale !== "en" &&
                                                            at(
                                                                "optional",
                                                                uiLocale,
                                                            )}
                                                    </Label>
                                                    <Input
                                                        id={`group_label_${locale}`}
                                                        dir={
                                                            locale === "fa"
                                                                ? "rtl"
                                                                : "ltr"
                                                        }
                                                        value={
                                                            data.group_label[
                                                                locale
                                                            ] ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "group_label",
                                                                {
                                                                    ...data.group_label,
                                                                    [locale]:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            )
                                                        }
                                                    />
                                                    {errors[
                                                        `group_label.${locale}`
                                                    ] && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                errors[
                                                                    `group_label.${locale}`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`label_${locale}`}
                                                >
                                                    {at("label", uiLocale)}{" "}
                                                    {locale !== "en" &&
                                                        at(
                                                            "optional",
                                                            uiLocale,
                                                        )}
                                                </Label>
                                                <Input
                                                    id={`label_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    value={
                                                        data.label[locale] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData("label", {
                                                            ...data.label,
                                                            [locale]:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors[`label.${locale}`] && (
                                                    <p className="text-sm text-destructive">
                                                        {
                                                            errors[
                                                                `label.${locale}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <div className="space-y-1.5">
                                    <Label htmlFor="url">
                                        {at("url_field", uiLocale)}
                                    </Label>
                                    <Input
                                        id="url"
                                        value={data.url}
                                        onChange={(e) =>
                                            setData("url", e.target.value)
                                        }
                                    />
                                    {errors.url && (
                                        <p className="text-sm text-destructive">
                                            {errors.url}
                                        </p>
                                    )}
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
                                        href={route("admin.menu-links.index")}
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
