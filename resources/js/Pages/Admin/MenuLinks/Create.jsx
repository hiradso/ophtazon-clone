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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        location: "footer",
        group_label: { en: "", fr: "" },
        label: { en: "", fr: "" },
        url: "",
        sort_order: "0",
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.menu-links.store"));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Menu Links", href: route("admin.menu-links.index") },
                { label: "Add Link" },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.menu-links.index")} />}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Add Menu Link
                    </h2>
                </div>
            }
        >
            <Head title="Add Menu Link" />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Link Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Location</Label>
                                    <Select
                                        value={data.location}
                                        onValueChange={(value) =>
                                            setData("location", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    value === "header"
                                                        ? "Top navigation"
                                                        : "Footer"
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="header">
                                                Top navigation
                                            </SelectItem>
                                            <SelectItem value="footer">
                                                Footer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

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
                                            {data.location === "footer" && (
                                                <div className="space-y-1.5">
                                                    <Label
                                                        htmlFor={`group_label_${locale}`}
                                                    >
                                                        Footer column{" "}
                                                        {locale === "fr" &&
                                                            "(optional)"}
                                                    </Label>
                                                    <Input
                                                        id={`group_label_${locale}`}
                                                        value={
                                                            data.group_label[
                                                                locale
                                                            ] ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "group_label",
                                                                {
                                                                    ...data.group_label,
                                                                    [locale]:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            )
                                                        }
                                                        placeholder={
                                                            locale === "en"
                                                                ? "Legal"
                                                                : "Mentions légales"
                                                        }
                                                    />
                                                    {errors[
                                                        `group_label.${locale}`
                                                    ] && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                errors[
                                                                    `group_label.${locale}`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Links with the same
                                                        column name are grouped
                                                        together in the footer.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`label_${locale}`}
                                                >
                                                    Label{" "}
                                                    {locale === "fr" &&
                                                        "(optional)"}
                                                </Label>
                                                <Input
                                                    id={`label_${locale}`}
                                                    value={
                                                        data.label[locale] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setData("label", {
                                                            ...data.label,
                                                            [locale]:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder={
                                                        locale === "en"
                                                            ? "Terms of Service"
                                                            : "Conditions d'utilisation"
                                                    }
                                                />
                                                {errors[`label.${locale}`] && (
                                                    <p className="text-sm text-destructive">
                                                        {
                                                            errors[
                                                                `label.${locale}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <div className="space-y-1.5">
                                    <Label htmlFor="url">URL</Label>
                                    <Input
                                        id="url"
                                        value={data.url}
                                        onChange={(e) =>
                                            setData("url", e.target.value)
                                        }
                                        placeholder="/pages/terms-of-service"
                                    />
                                    {errors.url && (
                                        <p className="text-sm text-destructive">
                                            {errors.url}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="sort_order">
                                        Sort order
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
                                    <Label htmlFor="is_active">Active</Label>
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
                                        href={route("admin.menu-links.index")}
                                    />
                                }
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Save Link"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
