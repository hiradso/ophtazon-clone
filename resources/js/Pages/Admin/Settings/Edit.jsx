import { useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MediaPicker from "@/Components/MediaPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { at } from "@/lib/admin-i18n";

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
    const { flash, locale: uiLocale } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(at(flash.success, uiLocale));
        if (flash?.error) toast.error(at(flash.error, uiLocale));
    }, [flash]);

    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name ?? "",
        logo: settings.logo ?? null,
        contact_email: settings.contact_email ?? "",
        contact_phone: settings.contact_phone ?? "",
        robots_txt: settings.robots_txt ?? "",
        font_latin: settings.font_latin ?? "Geist",
        font_persian: settings.font_persian ?? "Vazirmatn",
        slogan: {
            en: settings.slogan?.en ?? "",
            fr: settings.slogan?.fr ?? "",
            fa: settings.slogan?.fa ?? "",
        },
    });

    const setSlogan = (locale, value) => {
        setData("slogan", { ...data.slogan, [locale]: value });
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.settings.update"));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("settings", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("site_settings_title", uiLocale)}
                </h2>
            }
        >
            <Head title={at("site_settings_title", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} noValidate className="space-y-6">
                        {/* General */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{at("general", uiLocale)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="site_name">
                                        {at("site_name", uiLocale)}
                                    </Label>
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
                                    <Label>{at("logo", uiLocale)}</Label>
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
                                        {at("logo_fallback_hint", uiLocale)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* slogan */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("slogan_title", uiLocale)}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    {at("slogan_hint", uiLocale)}
                                </p>
                            </CardHeader>
                            <CardContent>
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

                                    {["en", "fr", "fa"].map((loc) => (
                                        <TabsContent
                                            key={loc}
                                            value={loc}
                                            dir={
                                                loc === "fa" ? "rtl" : "ltr"
                                            }
                                        >
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`slogan_${loc}`}
                                                >
                                                    {at("slogan_title", uiLocale)}{" "}
                                                    {loc !== "en" &&
                                                        at(
                                                            "optional",
                                                            uiLocale,
                                                        )}
                                                </Label>
                                                <Input
                                                    id={`slogan_${loc}`}
                                                    dir={
                                                        loc === "fa"
                                                            ? "rtl"
                                                            : "ltr"
                                                    }
                                                    value={data.slogan[loc]}
                                                    onChange={(e) =>
                                                        setSlogan(
                                                            loc,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                                {errors["slogan.en"] && (
                                    <p className="mt-1.5 text-sm text-destructive">
                                        {errors["slogan.en"]}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* contact information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("contact_information", uiLocale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="contact_email">
                                        {at("contact_email", uiLocale)}
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
                                        {at("contact_phone_field", uiLocale)}
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

                        {/* seo */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("seo_robots_title", uiLocale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="robots_txt">
                                            {at("content_field", uiLocale)}
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
                                            {at("reset_to_default", uiLocale)}
                                        </button>
                                    </div>
                                    <Textarea
                                        id="robots_txt"
                                        rows={8}
                                        dir="ltr"
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
                                        {at("robots_txt_hint", uiLocale)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* fonts */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("fonts_title", uiLocale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label>
                                        {at("latin_font_label", uiLocale)}
                                    </Label>
                                    <Select
                                        value={data.font_latin}
                                        onValueChange={(value) =>
                                            setData("font_latin", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) => value}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Geist">
                                                Geist
                                            </SelectItem>
                                            <SelectItem value="Inter">
                                                Inter
                                            </SelectItem>
                                            <SelectItem value="Roboto">
                                                Roboto
                                            </SelectItem>
                                            <SelectItem value="Poppins">
                                                Poppins
                                            </SelectItem>
                                            <SelectItem value="Nunito Sans">
                                                Nunito Sans
                                            </SelectItem>
                                            <SelectItem value="Playfair Display">
                                                Playfair Display
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.font_latin && (
                                        <p className="text-sm text-destructive">
                                            {errors.font_latin}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label>
                                        {at("persian_font_label", uiLocale)}
                                    </Label>
                                    <Select
                                        value={data.font_persian}
                                        onValueChange={(value) =>
                                            setData("font_persian", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) => value}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Vazirmatn">
                                                Vazirmatn
                                            </SelectItem>
                                            <SelectItem value="Noto Sans Arabic">
                                                Noto Sans Arabic
                                            </SelectItem>
                                            <SelectItem value="Rubik">
                                                Rubik
                                            </SelectItem>
                                            <SelectItem value="Noto Naskh Arabic">
                                                Noto Naskh Arabic
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.font_persian && (
                                        <p className="text-sm text-destructive">
                                            {errors.font_persian}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
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
