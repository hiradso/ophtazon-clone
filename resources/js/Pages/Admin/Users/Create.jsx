import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import PasswordStrengthMeter from "@/Components/PasswordStrengthMeter";
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
import { ArrowLeft, ArrowRight } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { getPasswordStrength } from "@/lib/passwordStrength";

export default function Create({ stores, countries }) {
    const { locale: uiLocale } = usePage().props;

    const ROLE_LABELS = {
        admin: at("role_admin", uiLocale),
        staff: at("role_staff", uiLocale),
        customer: at("role_customer", uiLocale),
    };

    const passwordLabels = {
        weak: at("password_strength_weak", uiLocale),
        medium: at("password_strength_medium", uiLocale),
        strong: at("password_strength_strong", uiLocale),
        length: at("password_criteria_length", uiLocale),
        lower: at("password_criteria_lower", uiLocale),
        upper: at("password_criteria_upper", uiLocale),
        number: at("password_criteria_number", uiLocale),
        special: at("password_criteria_special", uiLocale),
    };

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "staff",
        store_id: "",
        country_id: "",
        is_active: true,
    });

    const isPasswordWeak =
        getPasswordStrength(data.password).strength === "weak";

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.users.store"));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("users", uiLocale),
                    href: route("admin.users.index"),
                },
                { label: at("add_user", uiLocale) },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.users.index")} />}
                    >
                        {uiLocale === "fa" ? (
                            <ArrowRight className="size-4" />
                        ) : (
                            <ArrowLeft className="size-4" />
                        )}
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {at("add_user", uiLocale)}
                    </h2>
                </div>
            }
        >
            <Head title={at("add_user", uiLocale)} />

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
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">
                                        {at("name_field", uiLocale)}
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email">
                                        {at("email_field", uiLocale)}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password">
                                        {at("password", uiLocale)}
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">
                                            {errors.password}
                                        </p>
                                    )}
                                    <PasswordStrengthMeter
                                        password={data.password}
                                        labels={passwordLabels}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label>{at("role", uiLocale)}</Label>
                                    <Select
                                        value={data.role}
                                        onValueChange={(value) =>
                                            setData("role", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    ROLE_LABELS[value] ??
                                                    at("select_role", uiLocale)
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">
                                                {at("role_admin", uiLocale)}
                                            </SelectItem>
                                            <SelectItem value="staff">
                                                {at("role_staff", uiLocale)}
                                            </SelectItem>
                                            <SelectItem value="customer">
                                                {at("role_customer", uiLocale)}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-destructive">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label>{at("store", uiLocale)}</Label>
                                    <Select
                                        value={data.store_id}
                                        onValueChange={(value) =>
                                            setData("store_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    value
                                                        ? stores.find(
                                                              (s) =>
                                                                  String(
                                                                      s.id,
                                                                  ) === value,
                                                          )?.name
                                                        : at(
                                                              "no_brand",
                                                              uiLocale,
                                                          )
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stores.map((store) => (
                                                <SelectItem
                                                    key={store.id}
                                                    value={String(store.id)}
                                                >
                                                    {store.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.store_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.store_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label>{at("country", uiLocale)}</Label>
                                    <Select
                                        value={data.country_id}
                                        onValueChange={(value) =>
                                            setData("country_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    value
                                                        ? countries.find(
                                                              (c) =>
                                                                  String(
                                                                      c.id,
                                                                  ) === value,
                                                          )?.name
                                                        : at(
                                                              "select_country",
                                                              uiLocale,
                                                          )
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem
                                                    key={country.id}
                                                    value={String(country.id)}
                                                >
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.country_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.country_id}
                                        </p>
                                    )}
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
                                    <Link href={route("admin.users.index")} />
                                }
                            >
                                {at("cancel", uiLocale)}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || isPasswordWeak}
                            >
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
