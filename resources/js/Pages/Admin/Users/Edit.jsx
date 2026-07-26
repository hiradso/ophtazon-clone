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
import { ArrowLeft } from "lucide-react";

const ROLE_LABELS = { admin: "Admin", staff: "Staff", customer: "Customer" };

export default function Edit({ targetUser, stores, countries }) {
    const { data, setData, put, processing, errors } = useForm({
        name: targetUser.name ?? "",
        email: targetUser.email ?? "",
        password: "",
        role: targetUser.role ?? "staff",
        store_id: targetUser.store_id ? String(targetUser.store_id) : "",
        country_id: targetUser.country_id ? String(targetUser.country_id) : "",
        is_active: targetUser.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.users.update", targetUser.id));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Users", href: route("admin.users.index") },
                { label: targetUser.name },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.users.index")} />}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Edit User
                    </h2>
                </div>
            }
        >
            <Head title={`Edit — ${targetUser.name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
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
                                    <Label htmlFor="email">Email</Label>
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
                                        New password (leave blank to keep
                                        current)
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
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
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Role</Label>
                                    <Select
                                        value={data.role}
                                        onValueChange={(value) =>
                                            setData("role", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) => ROLE_LABELS[value]}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="staff">
                                                Staff
                                            </SelectItem>
                                            <SelectItem value="customer">
                                                Customer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {data.role === "staff" && (
                                    <div className="space-y-1.5">
                                        <Label>Store</Label>
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
                                                                      ) ===
                                                                      value,
                                                              )?.name
                                                            : "Select store"
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
                                )}

                                <div className="space-y-1.5">
                                    <Label>Country (optional)</Label>
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
                                                        : "None"
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
                                    <Link href={route("admin.users.index")} />
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
