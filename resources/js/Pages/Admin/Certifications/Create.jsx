import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MediaPicker from "@/Components/MediaPicker";
import { at } from "@/lib/admin-i18n";

export default function Create() {
    const { locale: uiLocale } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: { en: "", fr: "", fa: "" },
        issuing_body: { en: "", fr: "", fa: "" },
        description: { en: "", fr: "", fa: "" },
        image: "",
        sort_order: "0",
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.certifications.store"));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("certifications", uiLocale),
                    href: route("admin.certifications.index"),
                },
                { label: at("add_certification", uiLocale) },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={
                            <Link href={route("admin.certifications.index")} />
                        }
                    >
                        {uiLocale === "fa" ? (
                            <ArrowRight className="size-4" />
                        ) : (
                            <ArrowLeft className="size-4" />
                        )}
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {at("add_certification", uiLocale)}
                    </h2>
                </div>
            }
        >
            <Head title={at("add_certification", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} noValidate className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("basic_information", uiLocale)}
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
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`name_${locale}`}
                                                >
                                                    {at("name_field", uiLocale)}{" "}
                                                    {locale !== "en" &&
                                                        at(
                                                            "optional",
                                                            uiLocale,
                                                        )}
                                                </Label>
                                                <Input
                                                    id={`name_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    value={
                                                        data.name[locale] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData("name", {
                                                            ...data.name,
                                                            [locale]:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="ISO 13485"
                                                />
                                                {errors[`name.${locale}`] && (
                                                    <p className="text-sm text-destructive">
                                                        {
                                                            errors[
                                                                `name.${locale}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`issuing_body_${locale}`}
                                                >
                                                    {at(
                                                        "issuing_body",
                                                        uiLocale,
                                                    )}{" "}
                                                    {at("optional", uiLocale)}
                                                </Label>
                                                <Input
                                                    id={`issuing_body_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    value={
                                                        data.issuing_body[
                                                            locale
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "issuing_body",
                                                            {
                                                                ...data.issuing_body,
                                                                [locale]:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`description_${locale}`}
                                                >
                                                    {at(
                                                        "description",
                                                        uiLocale,
                                                    )}{" "}
                                                    {at("optional", uiLocale)}
                                                </Label>
                                                <Textarea
                                                    id={`description_${locale}`}
                                                    dir={
                                                        locale === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    rows={3}
                                                    value={
                                                        data.description[
                                                            locale
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "description",
                                                            {
                                                                ...data.description,
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

                                <Separator />

                                <div className="space-y-1.5">
                                    <Label>
                                        {at("badge_image", uiLocale)}
                                    </Label>
                                    <MediaPicker
                                        value={data.image}
                                        onSelect={(path) =>
                                            setData("image", path)
                                        }
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-destructive">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

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
                                        href={route(
                                            "admin.certifications.index",
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
