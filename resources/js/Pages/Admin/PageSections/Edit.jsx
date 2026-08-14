import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { HERO_ICON_LABELS, HERO_ICON_OPTIONS } from "@/lib/heroIcons";
import RichTextEditor from "@/Components/RichTextEditor";

const DEFAULT_TRUST_ITEMS = [
    { icon: "shield_check", label: { en: "", fr: "", fa: "" } },
    { icon: "globe", label: { en: "", fr: "", fa: "" } },
    { icon: "truck", label: { en: "", fr: "", fa: "" } },
];

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
        content:
            section.type === "hero"
                ? {
                      ...section.content,
                      badge: section.content?.badge ?? {
                          en: "",
                          fr: "",
                          fa: "",
                      },
                      trust_items:
                          section.content?.trust_items?.length > 0
                              ? section.content.trust_items
                              : DEFAULT_TRUST_ITEMS,
                  }
                : (section.content ?? {}),
        is_active: section.is_active ?? true,
    });

    const setField = (field, locale, value) => {
        setData("content", {
            ...data.content,
            [field]: { ...data.content[field], [locale]: value },
        });
    };

    const setTrustItemIcon = (index, icon) => {
        const items = [...data.content.trust_items];
        items[index] = { ...items[index], icon };
        setData("content", { ...data.content, trust_items: items });
    };

    const setTrustItemLabel = (index, locale, value) => {
        const items = [...data.content.trust_items];
        items[index] = {
            ...items[index],
            label: { ...items[index].label, [locale]: value },
        };
        setData("content", { ...data.content, trust_items: items });
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
                    <form onSubmit={submit} noValidate className="space-y-6">
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
                                                        <div className="space-y-2.5">
                                                            <Label
                                                                htmlFor={`title_${locale}`}
                                                            >
                                                                {at(
                                                                    "title",
                                                                    uiLocale,
                                                                )}
                                                            </Label>
                                                            <RichTextEditor
                                                                compact
                                                                headingLevels={[
                                                                    1, 2, 3,
                                                                ]}
                                                                value={
                                                                    data.content
                                                                        .title?.[
                                                                        locale
                                                                    ] ?? ""
                                                                }
                                                                onChange={(
                                                                    html,
                                                                ) =>
                                                                    setField(
                                                                        "title",
                                                                        locale,
                                                                        html,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-2.5">
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
                                                            <RichTextEditor
                                                                compact
                                                                headingLevels={[
                                                                    2, 3,
                                                                ]}
                                                                value={
                                                                    data.content
                                                                        .subtitle?.[
                                                                        locale
                                                                    ] ?? ""
                                                                }
                                                                onChange={(
                                                                    html,
                                                                ) =>
                                                                    setField(
                                                                        "subtitle",
                                                                        locale,
                                                                        html,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-2.5">
                                                            <Label
                                                                htmlFor={`badge_${locale}`}
                                                            >
                                                                {at(
                                                                    "badge_text",
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
                                                                id={`badge_${locale}`}
                                                                dir={
                                                                    locale ===
                                                                    "fa"
                                                                        ? "rtl"
                                                                        : "ltr"
                                                                }
                                                                value={
                                                                    data.content
                                                                        .badge?.[
                                                                        locale
                                                                    ] ?? ""
                                                                }
                                                                onChange={(e) =>
                                                                    setField(
                                                                        "badge",
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
                                                        <div className="space-y-2.5">
                                                            <Label
                                                                htmlFor={`heading_${locale}`}
                                                            >
                                                                {at(
                                                                    "heading",
                                                                    uiLocale,
                                                                )}{" "}
                                                                (H2){" "}
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
                                                        <div className="space-y-2.5">
                                                            <Label>
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
                                                            <RichTextEditor
                                                                value={
                                                                    data.content
                                                                        .body?.[
                                                                        locale
                                                                    ] ?? ""
                                                                }
                                                                onChange={(
                                                                    html,
                                                                ) =>
                                                                    setField(
                                                                        "body",
                                                                        locale,
                                                                        html,
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

                                {section.type === "hero" && (
                                    <div className="space-y-3 rounded-lg border border-border p-4">
                                        <p className="text-sm font-medium text-foreground">
                                            {at("trust_items", uiLocale)}
                                        </p>
                                        {data.content.trust_items.map(
                                            (trustItem, index) => (
                                                <div
                                                    key={index}
                                                    className="space-y-2 rounded-md border border-border p-3"
                                                >
                                                    <div className="space-y-2.5">
                                                        <Label>
                                                            {at(
                                                                "icon",
                                                                uiLocale,
                                                            )}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                trustItem.icon
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                setTrustItemIcon(
                                                                    index,
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue>
                                                                    {(
                                                                        value,
                                                                    ) =>
                                                                        HERO_ICON_LABELS[
                                                                            value
                                                                        ] ??
                                                                        value
                                                                    }
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {HERO_ICON_OPTIONS.map(
                                                                    (
                                                                        iconKey,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                iconKey
                                                                            }
                                                                            value={
                                                                                iconKey
                                                                            }
                                                                        >
                                                                            {
                                                                                HERO_ICON_LABELS[
                                                                                    iconKey
                                                                                ]
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid gap-2 sm:grid-cols-3">
                                                        {[
                                                            "en",
                                                            "fr",
                                                            "fa",
                                                        ].map((locale) => (
                                                            <div
                                                                key={locale}
                                                                className="space-y-1"
                                                            >
                                                                <Label className="text-xs text-muted-foreground uppercase">
                                                                    {locale}
                                                                </Label>
                                                                <Input
                                                                    dir={
                                                                        locale ===
                                                                        "fa"
                                                                            ? "rtl"
                                                                            : "ltr"
                                                                    }
                                                                    value={
                                                                        trustItem
                                                                            .label?.[
                                                                            locale
                                                                        ] ?? ""
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setTrustItemLabel(
                                                                            index,
                                                                            locale,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
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
