import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { at } from "@/lib/admin-i18n";

export default function Edit({ section }) {
    const { locale: uiLocale } = usePage().props;

    const TYPE_LABELS = {
        hero: at("type_hero", uiLocale),
        categories: at("type_categories", uiLocale),
        latest_products: at("type_latest_products", uiLocale),
        discounted_products: at("type_discounted_products", uiLocale),
        custom_content: at("type_custom_content", uiLocale),
    };

    const { data, setData, put, processing } = useForm({
        content: section.content ?? {},
        is_active: section.is_active ?? true,
    });

    const setField = (field, locale, value) => {
        setData("content", {
            ...data.content,
            [field]: { ...data.content[field], [locale]: value },
        });
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.page-sections.update", section.id));
    };

    const needsNoExtraFields =
        section.type === "categories" ||
        section.type === "latest_products" ||
        section.type === "discounted_products";

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("homepage_sections", uiLocale),
                    href: route("admin.page-sections.index"),
                },
                { label: TYPE_LABELS[section.type] },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={
                            <Link href={route("admin.page-sections.index")} />
                        }
                    >
                        {uiLocale === "fa" ? (
                            <ArrowRight className="size-4" />
                        ) : (
                            <ArrowLeft className="size-4" />
                        )}
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {at("edit_section_title", uiLocale)}
                    </h2>
                </div>
            }
        >
            <Head
                title={`${at("edit", uiLocale)} — ${TYPE_LABELS[section.type]}`}
            />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <CardTitle>
                                        {TYPE_LABELS[section.type]}
                                    </CardTitle>
                                    <Badge variant="outline">
                                        {at("type_cannot_change", uiLocale)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(section.type === "hero" ||
                                    section.type === "custom_content") && (
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
                                                    locale === "fa"
                                                        ? "rtl"
                                                        : "ltr"
                                                }
                                            >
                                                {section.type === "hero" && (
                                                    <>
                                                        <div className="space-y-1.5">
                                                            <Label
                                                                htmlFor={`title_${locale}`}
                                                            >
                                                                {at(
                                                                    "title",
                                                                    uiLocale,
                                                                )}{" "}
                                                                {locale !==
                                                                    "en" &&
                                                                    at(
                                                                        "optional",
                                                                        uiLocale,
                                                                    )}
                                                            </Label>
                                                            <Input
                                                                id={`title_${locale}`}
                                                                dir={
                                                                    locale ===
                                                                    "fa"
                                                                        ? "rtl"
                                                                        : "ltr"
                                                                }
                                                                value={
                                                                    data.content
                                                                        .title?.[
                                                                        locale
                                                                    ] ?? ""
                                                                }
                                                                onChange={(e) =>
                                                                    setField(
                                                                        "title",
                                                                        locale,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label
                                                                htmlFor={`subtitle_${locale}`}
                                                            >
                                                                {at(
                                                                    "subtitle",
                                                                    uiLocale,
                                                                )}{" "}
                                                                {locale !==
                                                                    "en" &&
                                                                    at(
                                                                        "optional",
                                                                        uiLocale,
                                                                    )}
                                                            </Label>
                                                            <Input
                                                                id={`subtitle_${locale}`}
                                                                dir={
                                                                    locale ===
                                                                    "fa"
                                                                        ? "rtl"
                                                                        : "ltr"
                                                                }
                                                                value={
                                                                    data.content
                                                                        .subtitle?.[
                                                                        locale
                                                                    ] ?? ""
                                                                }
                                                                onChange={(e) =>
                                                                    setField(
                                                                        "subtitle",
                                                                        locale,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {section.type ===
                                                    "custom_content" && (
                                                    <>
                                                        <div className="space-y-1.5">
                                                            <Label
                                                                htmlFor={`heading_${locale}`}
                                                            >
                                                                {at(
                                                                    "heading",
                                                                    uiLocale,
                                                                )}{" "}
                                                                {locale !==
                                                                    "en" &&
                                                                    at(
                                                                        "optional",
                                                                        uiLocale,
                                                                    )}
                                                            </Label>
                                                            <Input
                                                                id={`heading_${locale}`}
                                                                dir={
                                                                    locale ===
                                                                    "fa"
                                                                        ? "rtl"
                                                                        : "ltr"
                                                                }
                                                                value={
                                                                    data.content
                                                                        .heading?.[
                                                                        locale
                                                                    ] ?? ""
                                                                }
                                                                onChange={(e) =>
                                                                    setField(
                                                                        "heading",
                                                                        locale,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label
                                                                htmlFor={`body_${locale}`}
                                                            >
                                                                {at(
                                                                    "body_text",
                                                                    uiLocale,
                                                                )}{" "}
                                                                {locale !==
                                                                    "en" &&
                                                                    at(
                                                                        "optional",
                                                                        uiLocale,
                                                                    )}
                                                            </Label>
                                                            <Input
                                                                id={`body_${locale}`}
                                                                dir={
                                                                    locale ===
                                                                    "fa"
                                                                        ? "rtl"
                                                                        : "ltr"
                                                                }
                                                                value={
                                                                    data.content
                                                                        .body?.[
                                                                        locale
                                                                    ] ?? ""
                                                                }
                                                                onChange={(e) =>
                                                                    setField(
                                                                        "body",
                                                                        locale,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                )}

                                {needsNoExtraFields && (
                                    <p className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
                                        {at("no_extra_fields_hint", uiLocale)}
                                    </p>
                                )}

                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData("is_active", checked)
                                        }
                                    />
                                    <Label htmlFor="is_active">
                                        {at("visible_on_homepage", uiLocale)}
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
                                        href={route(
                                            "admin.page-sections.index",
                                        )}
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
