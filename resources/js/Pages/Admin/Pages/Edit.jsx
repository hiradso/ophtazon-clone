import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
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

export default function Edit({ page }) {
    const { data, setData, put, processing, errors } = useForm({
        title: page.title ?? { en: "", fr: "" },
        slug: page.slug ?? "",
        content: page.content ?? { en: "", fr: "" },
        featured_image: page.featured_image ?? null,
        image_display_style: page.image_display_style ?? "banner",
        meta_description: page.meta_description ?? { en: "", fr: "" },
        is_published: page.is_published ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.pages.update", page.id));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Pages", href: route("admin.pages.index") },
                { label: page.title.en },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.pages.index")} />}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Edit Page
                    </h2>
                </div>
            }
        >
            <Head title={`Edit — ${page.title.en}`} />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Details</CardTitle>
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

                                    {["en", "fr"].map((locale) => (
                                        <TabsContent
                                            key={locale}
                                            value={locale}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`title_${locale}`}
                                                >
                                                    Title{" "}
                                                    {locale === "fr" &&
                                                        "(optional)"}
                                                </Label>
                                                <Input
                                                    id={`title_${locale}`}
                                                    value={
                                                        data.title[locale] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData("title", {
                                                            ...data.title,
                                                            [locale]:
                                                                e.target.value,
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

                                            <div className="space-y-1.5">
                                                <Label>
                                                    Content{" "}
                                                    {locale === "fr" &&
                                                        "(optional)"}
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

                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`meta_${locale}`}
                                                >
                                                    Meta description (SEO)
                                                </Label>
                                                <Textarea
                                                    id={`meta_${locale}`}
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
                                    <p className="text-xs text-muted-foreground">
                                        Available at /pages/{data.slug}
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label>Image (optional)</Label>
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

                                    <div className="space-y-1.5">
                                        <Label>Display style</Label>
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
                                                            ? "Simple banner"
                                                            : "Full-width background"
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="banner">
                                                    Simple banner
                                                </SelectItem>
                                                <SelectItem value="background">
                                                    Full-width background
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
                                        Published
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
