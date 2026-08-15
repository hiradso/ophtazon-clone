import { useState } from "react";
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
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { t } from "@/lib/translate";
import { stripHtml } from "@/lib/richText";

export default function Edit({
    menuLink,
    pageOptions,
    parentOptions,
    footerGroupOptions,
}) {
    const { locale: uiLocale } = usePage().props;
    const [linkType, setLinkType] = useState(
        menuLink.page_id ? "existing_page" : "custom_url",
    );
    const [footerColumnMode, setFooterColumnMode] = useState(
        menuLink.group_label?.en &&
            footerGroupOptions.some((g) => g.en === menuLink.group_label.en)
            ? "existing"
            : "new",
    );

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
        page_id: menuLink.page_id ? String(menuLink.page_id) : "",
        parent_id: menuLink.parent_id ? String(menuLink.parent_id) : "",
        sort_order: menuLink.sort_order ?? "0",
        is_active: menuLink.is_active ?? true,
    });

    const availableParents = parentOptions.filter(
        (parent) => parent.location === data.location,
    );

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
                    <form onSubmit={submit} noValidate className="space-y-6">
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

                                {data.location === "footer" && (
                                    <div className="space-y-1.5">
                                        <Label>
                                            {at(
                                                "footer_column_select",
                                                uiLocale,
                                            )}
                                        </Label>
                                        <Select
                                            value={
                                                footerColumnMode === "new"
                                                    ? "__new__"
                                                    : (data.group_label.en ??
                                                      "")
                                            }
                                            onValueChange={(value) => {
                                                if (value === "__new__") {
                                                    setFooterColumnMode(
                                                        "new",
                                                    );
                                                    setData("group_label", {
                                                        en: "",
                                                        fr: "",
                                                        fa: "",
                                                    });
                                                    return;
                                                }
                                                setFooterColumnMode(
                                                    "existing",
                                                );
                                                const match =
                                                    footerGroupOptions.find(
                                                        (g) => g.en === value,
                                                    );
                                                setData("group_label", {
                                                    en: match?.en ?? "",
                                                    fr: match?.fr ?? "",
                                                    fa: match?.fa ?? "",
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue>
                                                    {(value) =>
                                                        value === "__new__"
                                                            ? at(
                                                                  "footer_column_new_option",
                                                                  uiLocale,
                                                              )
                                                            : value
                                                              ? t(
                                                                    footerGroupOptions.find(
                                                                        (g) =>
                                                                            g.en ===
                                                                            value,
                                                                    ) ?? {},
                                                                    uiLocale,
                                                                )
                                                              : at(
                                                                    "footer_column_select",
                                                                    uiLocale,
                                                                )
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {footerGroupOptions.map(
                                                    (group) => (
                                                        <SelectItem
                                                            key={group.en}
                                                            value={group.en}
                                                        >
                                                            {t(
                                                                group,
                                                                uiLocale,
                                                            )}
                                                        </SelectItem>
                                                    ),
                                                )}
                                                <SelectItem value="__new__">
                                                    {at(
                                                        "footer_column_new_option",
                                                        uiLocale,
                                                    )}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            {at(
                                                "footer_column_select_hint",
                                                uiLocale,
                                            )}
                                        </p>
                                    </div>
                                )}

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
                                            {data.location === "footer" &&
                                                footerColumnMode === "new" && (
                                                <div className="space-y-1.5">
                                                    <Label
                                                        htmlFor={`group_label_${locale}`}
                                                    >
                                                        {at(
                                                            "footer_column_new_name",
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
                                    <Label>{at("link_type", uiLocale)}</Label>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {[
                                            {
                                                value: "existing_page",
                                                title: at(
                                                    "existing_page",
                                                    uiLocale,
                                                ),
                                                desc: at(
                                                    "existing_page_desc",
                                                    uiLocale,
                                                ),
                                            },
                                            {
                                                value: "custom_url",
                                                title: at(
                                                    "custom_url",
                                                    uiLocale,
                                                ),
                                                desc: at(
                                                    "custom_url_desc",
                                                    uiLocale,
                                                ),
                                            },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setLinkType(option.value);
                                                    setData({
                                                        ...data,
                                                        url: "",
                                                        page_id: "",
                                                    });
                                                }}
                                                className={`flex items-start gap-2 rounded-lg border p-3 text-start transition-colors ${
                                                    linkType === option.value
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:bg-accent"
                                                }`}
                                            >
                                                <div
                                                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                                                        linkType ===
                                                        option.value
                                                            ? "border-primary bg-primary text-primary-foreground"
                                                            : "border-muted-foreground"
                                                    }`}
                                                >
                                                    {linkType ===
                                                        option.value && (
                                                        <Check className="size-3" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {option.title}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {option.desc}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {linkType === "custom_url" ? (
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
                                        <p className="text-xs text-muted-foreground">
                                            {data.url
                                                ? `${at("link_preview", uiLocale)}: ${data.url}`
                                                : at(
                                                      "link_preview_url_missing",
                                                      uiLocale,
                                                  )}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <Label>
                                            {at("select_page", uiLocale)}
                                        </Label>
                                        <Select
                                            value={data.page_id}
                                            onValueChange={(value) =>
                                                setData("page_id", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue>
                                                    {(value) =>
                                                        value
                                                            ? stripHtml(
                                                                  pageOptions.find(
                                                                      (p) =>
                                                                          String(
                                                                              p.id,
                                                                          ) ===
                                                                          value,
                                                                  )?.title.en,
                                                              )
                                                            : at(
                                                                  "select_page",
                                                                  uiLocale,
                                                              )
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pageOptions.map((page) => (
                                                    <SelectItem
                                                        key={page.id}
                                                        value={String(page.id)}
                                                    >
                                                        {stripHtml(
                                                            page.title.en,
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.page_id && (
                                            <p className="text-sm text-destructive">
                                                {errors.page_id}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {data.page_id
                                                ? `${at("link_preview", uiLocale)}: /pages/${
                                                      pageOptions.find(
                                                          (p) =>
                                                              String(p.id) ===
                                                              data.page_id,
                                                      )?.slug
                                                  }`
                                                : at(
                                                      "link_preview_page_missing",
                                                      uiLocale,
                                                  )}
                                        </p>
                                    </div>
                                )}

                                {data.location === "header" && (
                                    <div className="space-y-1.5">
                                        <Label>
                                            {at(
                                                "parent_menu_item",
                                                uiLocale,
                                            )}
                                        </Label>
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
                                                            ? availableParents.find(
                                                                  (p) =>
                                                                      String(
                                                                          p.id,
                                                                      ) ===
                                                                      value,
                                                              )?.label.en
                                                            : at(
                                                                  "select_parent",
                                                                  uiLocale,
                                                              )
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableParents.map(
                                                    (parent) => (
                                                        <SelectItem
                                                            key={parent.id}
                                                            value={String(
                                                                parent.id,
                                                            )}
                                                        >
                                                            {parent.label.en}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.parent_id && (
                                            <p className="text-sm text-destructive">
                                                {errors.parent_id}
                                            </p>
                                        )}
                                    </div>
                                )}

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
