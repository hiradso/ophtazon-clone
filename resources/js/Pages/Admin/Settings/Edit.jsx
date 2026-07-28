import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Edit({ settings }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        site_name: settings.site_name ?? "",
        logo: null,
        contact_email: settings.contact_email ?? "",
        contact_phone: settings.contact_phone ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            _method: "put",
        }));
        post(route("admin.settings.update"), { forceFormData: true });
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

                                {settings.logo && (
                                    <div className="space-y-1.5">
                                        <Label>Current logo</Label>
                                        <img
                                            src={`/storage/${settings.logo}`}
                                            alt=""
                                            className="h-16 w-16 rounded-md border border-border object-contain bg-card p-2"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <Label htmlFor="logo">
                                        {settings.logo
                                            ? "Replace logo"
                                            : "Logo (optional)"}
                                    </Label>
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData("logo", e.target.files[0])
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
