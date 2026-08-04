import { Head, Link, useForm } from "@inertiajs/react";
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
import { ArrowLeft } from "lucide-react";

const TYPE_LABELS = {
    hero: "Hero Banner",
    categories: "Category Grid",
    latest_products: "Latest Listings",
    discounted_products: "On Sale (Discounted Products)",
    custom_content: "Custom Content",
};

const DEFAULT_CONTENT = {
    hero: {
        title: { en: "", fr: "", fa: "" },
        subtitle: { en: "", fr: "", fa: "" },
    },
    categories: {},
    latest_products: {},
    discounted_products: {},
    custom_content: {
        heading: { en: "", fr: "", fa: "" },
        body: { en: "", fr: "", fa: "" },
    },
};

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        type: "hero",
        content: DEFAULT_CONTENT.hero,
        is_active: true,
    });

    const changeType = (type) => {
        setData({ ...data, type, content: DEFAULT_CONTENT[type] });
    };

    const setField = (field, locale, value) => {
        setData("content", {
            ...data.content,
            [field]: { ...data.content[field], [locale]: value },
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.page-sections.store"));
    };

    const needsNoExtraFields =
        data.type === "categories" ||
        data.type === "latest_products" ||
        data.type === "discounted_products";

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Homepage", href: route("admin.page-sections.index") },
                { label: "Add Section" },
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
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Add Section
                    </h2>
                </div>
            }
        >
            <Head title="Add Section" />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Type</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select
                                    value={data.type}
                                    onValueChange={changeType}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {(value) => TYPE_LABELS[value]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hero">
                                            Hero Banner
                                        </SelectItem>
                                        <SelectItem value="categories">
                                            Category Grid
                                        </SelectItem>
                                        <SelectItem value="latest_products">
                                            Latest Listings
                                        </SelectItem>
                                        <SelectItem value="discounted_products">
                                            On Sale (Discounted Products)
                                        </SelectItem>
                                        <SelectItem value="custom_content">
                                            Custom Content
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {(data.type === "hero" ||
                                    data.type === "custom_content") && (
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
                                                {data.type === "hero" && (
                                                    <>
                                                        <div className="space-y-1.5">
                                                            <Label
                                                                htmlFor={`title_${locale}`}
                                                            >
                                                                Title{" "}
                                                                {locale !==
                                                                    "en" &&
                                                                    "(optional)"}
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
                                                                Subtitle{" "}
                                                                {locale !==
                                                                    "en" &&
                                                                    "(optional)"}
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

                                                {data.type ===
                                                    "custom_content" && (
                                                    <>
                                                        <div className="space-y-1.5">
                                                            <Label
                                                                htmlFor={`heading_${locale}`}
                                                            >
                                                                Heading{" "}
                                                                {locale !==
                                                                    "en" &&
                                                                    "(optional)"}
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
                                                                Body text{" "}
                                                                {locale !==
                                                                    "en" &&
                                                                    "(optional)"}
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
                                        This section pulls data automatically —
                                        no extra fields needed.
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
                                        Visible on homepage
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
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Add Section"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
