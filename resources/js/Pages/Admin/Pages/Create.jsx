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
import RichTextEditor from "@/Components/RichTextEditor";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        slug: "",
        content: "",
        featured_image: null,
        image_display_style: "banner",
        meta_description: "",
        is_published: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.pages.store"), { forceFormData: true });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Pages", href: route("admin.pages.index") },
                { label: "Add Page" },
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
                        Add Page
                    </h2>
                </div>
            }
        >
            <Head title="Add Page" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-destructive">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData("slug", e.target.value)
                                            }
                                            placeholder="about-us"
                                        />
                                        {errors.slug && (
                                            <p className="text-sm text-destructive">
                                                {errors.slug}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Will be available at /pages/
                                            {data.slug || "..."}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Content</Label>
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={(html) =>
                                            setData("content", html)
                                        }
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-destructive">
                                            {errors.content}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="featured_image">
                                            Image (optional)
                                        </Label>
                                        <Input
                                            id="featured_image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData(
                                                    "featured_image",
                                                    e.target.files[0],
                                                )
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
                                <div className="space-y-1.5">
                                    <Label htmlFor="meta_description">
                                        Meta description (SEO)
                                    </Label>
                                    <Textarea
                                        id="meta_description"
                                        rows={2}
                                        value={data.meta_description}
                                        onChange={(e) =>
                                            setData(
                                                "meta_description",
                                                e.target.value,
                                            )
                                        }
                                    />
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
                                {processing ? "Saving..." : "Save Page"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
