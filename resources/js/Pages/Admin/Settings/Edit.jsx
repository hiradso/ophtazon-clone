import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MediaPicker from "@/Components/MediaPicker";

const DEFAULT_ROBOTS_TXT = [
    "User-agent: *",
    "Disallow: /admin",
    "Disallow: /checkout",
    "Disallow: /cart",
    "Disallow: /profile",
    "Disallow: /my-orders",
    "",
    "Sitemap: " +
        (typeof window !== "undefined" ? window.location.origin : "") +
        "/sitemap.xml",
].join("\n");

export default function Edit({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name ?? "",
        logo: settings.logo ?? null,
        contact_email: settings.contact_email ?? "",
        contact_phone: settings.contact_phone ?? "",
        robots_txt: settings.robots_txt ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.settings.update"));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Settings" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Site Settings
                </h2>
            }
        >
            <Head title="Site Settings" />
            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>General</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="site_name">Site name</Label>
                                    <Input
                                        id="site_name"
                                        value={data.site_name}
                                        onChange={(e) =>
                                            setData("site_name", e.target.value)
                                        }
                                    />
                                    {errors.site_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.site_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Logo</Label>
                                    <MediaPicker
                                        value={data.logo}
                                        onSelect={(path) =>
                                            setData("logo", path)
                                        }
                                    />
                                    {errors.logo && (
                                        <p className="text-sm text-destructive">
                                            {errors.logo}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        If left empty, the site name initial
                                        will be used as a fallback.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="contact_email">
                                        Contact email
                                    </Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) =>
                                            setData(
                                                "contact_email",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.contact_email && (
                                        <p className="text-sm text-destructive">
                                            {errors.contact_email}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="contact_phone">
                                        Contact phone
                                    </Label>
                                    <Input
                                        id="contact_phone"
                                        value={data.contact_phone}
                                        onChange={(e) =>
                                            setData(
                                                "contact_phone",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO — robots.txt</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="robots_txt">
                                            Content
                                        </Label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    "robots_txt",
                                                    DEFAULT_ROBOTS_TXT,
                                                )
                                            }
                                            className="text-xs font-medium text-primary hover:underline"
                                        >
                                            Reset to default
                                        </button>
                                    </div>
                                    <Textarea
                                        id="robots_txt"
                                        rows={8}
                                        className="font-mono text-sm"
                                        placeholder={DEFAULT_ROBOTS_TXT}
                                        value={data.robots_txt}
                                        onChange={(e) =>
                                            setData(
                                                "robots_txt",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.robots_txt && (
                                        <p className="text-sm text-destructive">
                                            {errors.robots_txt}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Controls which parts of the site search
                                        engines are allowed to crawl. Leave
                                        empty to use the safe default shown
                                        above.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Save Settings"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
