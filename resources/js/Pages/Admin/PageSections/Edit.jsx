import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const TYPE_LABELS = {
    hero: "Hero Banner",
    categories: "Category Grid",
    latest_products: "Latest Listings",
    custom_content: "Custom Content",
};

export default function Edit({ section }) {
    const { data, setData, put, processing, errors } = useForm({
        content: section.content ?? {},
        is_active: section.is_active ?? true,
    });

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
                                {section.type === "hero" && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={data.content.title ?? ""}
                                                onChange={(e) =>
                                                    setData("content", {
                                                        ...data.content,
                                                        title: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="subtitle">
                                                Subtitle
                                            </Label>
                                            <Textarea
                                                id="subtitle"
                                                rows={2}
                                                value={
                                                    data.content.subtitle ?? ""
                                                }
                                                onChange={(e) =>
                                                    setData("content", {
                                                        ...data.content,
                                                        subtitle:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                {section.type === "custom_content" && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="heading">
                                                Heading
                                            </Label>
                                            <Input
                                                id="heading"
                                                value={
                                                    data.content.heading ?? ""
                                                }
                                                onChange={(e) =>
                                                    setData("content", {
                                                        ...data.content,
                                                        heading: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="body">
                                                Body text
                                            </Label>
                                            <Textarea
                                                id="body"
                                                rows={4}
                                                value={data.content.body ?? ""}
                                                onChange={(e) =>
                                                    setData("content", {
                                                        ...data.content,
                                                        body: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </>
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
