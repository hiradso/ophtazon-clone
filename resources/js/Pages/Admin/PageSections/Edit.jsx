import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

const TYPE_LABELS = {
    hero: "Hero Banner",
    categories: "Category Grid",
    latest_products: "Latest Listings",
    custom_content: "Custom Content",
};

export default function Edit({ section }) {
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

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Homepage", href: route("admin.page-sections.index") },
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
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Edit Section
                    </h2>
                </div>
            }
        >
            <Head title={`Edit — ${TYPE_LABELS[section.type]}`} />

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
                                        Type cannot be changed
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
                                        </TabsList>

                                        {["en", "fr"].map((locale) => (
                                            <TabsContent
                                                key={locale}
                                                value={locale}
                                                className="space-y-4"
                                            >
                                                {section.type === "hero" && (
                                                    <>
                                                        <div className="space-y-1.5">
                                                            <Label
                                                                htmlFor={`title_${locale}`}
                                                            >
                                                                Title{" "}
                                                                {locale ===
                                                                    "fr" &&
                                                                    "(optional)"}
                                                            </Label>
                                                            <Input
                                                                id={`title_${locale}`}
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
                                                                {locale ===
                                                                    "fr" &&
                                                                    "(optional)"}
                                                            </Label>
                                                            <Input
                                                                id={`subtitle_${locale}`}
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
                                                                Heading{" "}
                                                                {locale ===
                                                                    "fr" &&
                                                                    "(optional)"}
                                                            </Label>
                                                            <Input
                                                                id={`heading_${locale}`}
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
                                                                {locale ===
                                                                    "fr" &&
                                                                    "(optional)"}
                                                            </Label>
                                                            <Input
                                                                id={`body_${locale}`}
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

                                {(section.type === "categories" ||
                                    section.type === "latest_products") && (
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
                                {processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
