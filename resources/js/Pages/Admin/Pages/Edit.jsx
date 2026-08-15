import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/Components/RichTextEditor";
import MediaPicker from "@/Components/MediaPicker";
import { at } from "@/lib/admin-i18n";
import { stripHtml } from "@/lib/richText";

export default function Edit({ page, parentOptions }) {
    const { locale: uiLocale } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        parent_id: page.parent_id ? String(page.parent_id) : "",
        title: {
            en: page.title?.en ?? "",
            fr: page.title?.fr ?? "",
            fa: page.title?.fa ?? "",
        },
        slug: page.slug ?? "",
        content: {
            en: page.content?.en ?? "",
            fr: page.content?.fr ?? "",
            fa: page.content?.fa ?? "",
        },
        featured_image: page.featured_image ?? null,
        image_display_style: page.image_display_style ?? "banner",
        meta_description: {
            en: page.meta_description?.en ?? "",
            fr: page.meta_description?.fr ?? "",
            fa: page.meta_description?.fa ?? "",
        },
        is_published: page.is_published ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.pages.update", page.id));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("pages", uiLocale),
                    href: route("admin.pages.index"),
                },
                { label: stripHtml(page.title.en) },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.pages.index")} />}
                    >
                        {uiLocale === "fa" ? (
                            <ArrowRight className="size-4" />
                        ) : (
                            <ArrowLeft className="size-4" />
                        )}
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {at("edit", uiLocale)} {at("page_singular", uiLocale)}
                    </h2>
                </div>
            }
        >
            <Head
                title={`${at("edit", uiLocale)} — ${stripHtml(page.title.en)}`}
            />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} noValidate className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("page_details", uiLocale)}
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
                                            <div className="space-y-2.5">
                                                <Label
                                                    htmlFor={`title_${locale}`}
                                                >
                                                    {at("title", uiLocale)}
                                                </Label>
                                                <RichTextEditor
                                                    compact
                                                    headingLevels={[1, 2, 3]}
                                                    value={
                                                        data.title[locale] ?? ""
                                                    }
                                                    onChange={(html) =>
                                                        setData("title", {
                                                            ...data.title,
                                                            [locale]: html,
                                                        })
                                                    }
                                                />
                                                {errors[`title.${locale}`] && (
                                                    <p className="text-sm text-destructive">
                                                        {
                                                            errors[
                                                                `title.${locale}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2.5">
                                                <Label>
                                                    {at("content", uiLocale)}{" "}
                                                    {locale !== "en" &&
                                                        at(
                                                            "optional",
                                                            uiLocale,
                                                        )}
                                                </Label>
                                                <RichTextEditor
                                                    value={
                                                        data.content[locale] ??
                                                        ""
                                                    }
                                                    onChange={(html) =>
                                                        setData("content", {
                                                            ...data.content,
                                                            [locale]: html,
                                                        })
                                                    }
                                                />
                                                {errors[
                                                    `content.${locale}`
                                                ] && (
                                                    <p className="text-sm text-destructive">
                                                        {
                                                            errors[
                                                                `content.${locale}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2.5">
                                                <Label
                                                    htmlFor={`meta_${locale}`}
                                                >
                                                    {at(
                                                        "meta_description_seo",
                                                        uiLocale,
                                                    )}
                                                </Label>
                                                <Textarea
                                                    id={`meta_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    rows={2}
                                                    value={
                                                        data.meta_description[
                                                            locale
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "meta_description",
                                                            {
                                                                ...data.meta_description,
                                                                [locale]:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                />
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <div className="space-y-2.5">
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
                                                        ? stripHtml(
                                                              parentOptions.find(
                                                                  (p) =>
                                                                      String(
                                                                          p.id,
                                                                      ) ===
                                                                      value,
                                                              )?.title.en,
                                                          )
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
                                                    {stripHtml(
                                                        parent.title.en,
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2.5">
                                    <Label>{at("slug", uiLocale)}</Label>
                                    <div
                                        className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-muted-foreground"
                                        dir="ltr"
                                    >
                                        {data.slug || "—"}
                                    </div>
                                    {errors.slug && (
                                        <p className="text-sm text-destructive">
                                            {errors.slug}
                                        </p>
                                    )}
                                    <p
                                        className="text-xs text-muted-foreground"
                                        dir="ltr"
                                    >
                                        {at("slug_locked_hint", uiLocale)}{" "}
                                        {at("slug_hint_prefix", uiLocale)}
                                        {data.slug}
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2.5">
                                        <Label>
                                            {at("image_optional", uiLocale)}
                                        </Label>
                                        <MediaPicker
                                            value={data.featured_image}
                                            onSelect={(path) =>
                                                setData("featured_image", path)
                                            }
                                        />
                                        {errors.featured_image && (
                                            <p className="text-sm text-destructive">
                                                {errors.featured_image}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2.5">
                                        <Label>
                                            {at("display_style", uiLocale)}
                                        </Label>
                                        <Select
                                            value={data.image_display_style}
                                            onValueChange={(value) =>
                                                setData(
                                                    "image_display_style",
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue>
                                                    {(value) =>
                                                        value === "banner"
                                                            ? at(
                                                                  "simple_banner",
                                                                  uiLocale,
                                                              )
                                                            : at(
                                                                  "full_width_background",
                                                                  uiLocale,
                                                              )
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="banner">
                                                    {at(
                                                        "simple_banner",
                                                        uiLocale,
                                                    )}
                                                </SelectItem>
                                                <SelectItem value="background">
                                                    {at(
                                                        "full_width_background",
                                                        uiLocale,
                                                    )}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(checked) =>
                                            setData("is_published", checked)
                                        }
                                    />
                                    <Label htmlFor="is_published">
                                        {at("published", uiLocale)}
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
                                    <Link href={route("admin.pages.index")} />
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
