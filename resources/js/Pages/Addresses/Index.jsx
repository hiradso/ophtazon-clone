import { useEffect, useState } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MapPin,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Star,
} from "lucide-react";
import { tt } from "@/lib/i18n";

const emptyForm = {
    full_name: "",
    phone: "",
    country_id: "",
    city: "",
    address_line: "",
    postal_code: "",
    is_default: false,
};

export default function Index({ addresses, countries }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [editingAddress, setEditingAddress] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm(emptyForm);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const openCreate = () => {
        setEditingAddress(null);
        reset();
        clearErrors();
        setFormOpen(true);
    };

    const openEdit = (address) => {
        setEditingAddress(address);
        setData({
            full_name: address.full_name,
            phone: address.phone,
            country_id: String(address.country_id),
            city: address.city,
            address_line: address.address_line,
            postal_code: address.postal_code ?? "",
            is_default: address.is_default,
        });
        clearErrors();
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingAddress(null);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();

        if (editingAddress) {
            put(route("addresses.update", editingAddress.id), {
                onSuccess: () => closeForm(),
            });
        } else {
            post(route("addresses.store"), {
                onSuccess: () => closeForm(),
            });
        }
    };

    const confirmDelete = () => {
        router.delete(route("addresses.destroy", addressToDelete.id), {
            onSuccess: () => setAddressToDelete(null),
        });
    };

    const setDefault = (address) => {
        router.post(route("addresses.setDefault", address.id));
    };

    return (
        <PublicLayout>
            <Head title={tt("my_addresses", uiLocale)} />

            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {tt("my_addresses", uiLocale)}
                    </h1>
                    <Button size="sm" onClick={openCreate}>
                        <Plus className="me-1.5 size-4" />
                        {tt("add_address", uiLocale)}
                    </Button>
                </div>

                {addresses.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border py-16 text-center">
                        <MapPin className="mx-auto mb-3 size-10 text-muted-foreground" />
                        <p className="mb-4 text-sm text-muted-foreground">
                            {tt("no_addresses_yet", uiLocale)}
                        </p>
                        <Button size="sm" onClick={openCreate}>
                            <Plus className="me-1.5 size-4" />
                            {tt("add_address", uiLocale)}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {addresses.map((address) => (
                            <Card key={address.id} className="relative">
                                <CardContent className="space-y-1.5 p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-medium text-foreground">
                                            {address.full_name}
                                        </p>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7"
                                                    >
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                }
                                            />
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        openEdit(address)
                                                    }
                                                >
                                                    <Pencil className="me-2 size-4" />
                                                    {tt("edit_address", uiLocale)}
                                                </DropdownMenuItem>
                                                {!address.is_default && (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setDefault(address)
                                                        }
                                                    >
                                                        <Star className="me-2 size-4" />
                                                        {tt(
                                                            "set_as_default",
                                                            uiLocale,
                                                        )}
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() =>
                                                        setAddressToDelete(
                                                            address,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="me-2 size-4" />
                                                    {tt(
                                                        "delete_address",
                                                        uiLocale,
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {address.is_default && (
                                        <Badge
                                            variant="outline"
                                            className="border-primary/30 bg-primary/10 text-primary"
                                        >
                                            <Star className="me-1 size-3" />
                                            {tt("default_address", uiLocale)}
                                        </Badge>
                                    )}

                                    <p className="text-sm text-muted-foreground">
                                        {address.phone}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.address_line},{" "}
                                        {address.city}
                                        {address.country?.name &&
                                            `, ${address.country.name}`}
                                        {address.postal_code &&
                                            ` — ${address.postal_code}`}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* فرم افزودن/ویرایش آدرس */}
            <Dialog
                open={formOpen}
                onOpenChange={(open) => !open && closeForm()}
            >
                <DialogContent>
                    <form onSubmit={submit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingAddress
                                    ? tt("edit_address", uiLocale)
                                    : tt("add_address", uiLocale)}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="full_name">
                                        {tt("full_name_field", uiLocale)}
                                    </Label>
                                    <Input
                                        id="full_name"
                                        value={data.full_name}
                                        onChange={(e) =>
                                            setData(
                                                "full_name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.full_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.full_name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone">
                                        {tt("phone_field", uiLocale)}
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-destructive">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>{tt("country_field", uiLocale)}</Label>
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
                                                              String(c.id) ===
                                                              value,
                                                      )?.name
                                                    : tt(
                                                          "country_field",
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

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="city">
                                        {tt("city_field", uiLocale)}
                                    </Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData("city", e.target.value)
                                        }
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-destructive">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="postal_code">
                                        {tt("postal_code_field", uiLocale)}
                                    </Label>
                                    <Input
                                        id="postal_code"
                                        value={data.postal_code}
                                        onChange={(e) =>
                                            setData(
                                                "postal_code",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="address_line">
                                    {tt("address_line_field", uiLocale)}
                                </Label>
                                <Textarea
                                    id="address_line"
                                    rows={3}
                                    value={data.address_line}
                                    onChange={(e) =>
                                        setData(
                                            "address_line",
                                            e.target.value,
                                        )
                                    }
                                />
                                {errors.address_line && (
                                    <p className="text-sm text-destructive">
                                        {errors.address_line}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-border p-3">
                                <Label
                                    htmlFor="is_default"
                                    className="cursor-pointer"
                                >
                                    {tt("set_as_default", uiLocale)}
                                </Label>
                                <Switch
                                    id="is_default"
                                    checked={data.is_default}
                                    onCheckedChange={(checked) =>
                                        setData("is_default", checked)
                                    }
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeForm}
                            >
                                {tt("cancel", uiLocale)}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {tt("save", uiLocale)}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* تأیید حذف */}
            <Dialog
                open={!!addressToDelete}
                onOpenChange={(open) => !open && setAddressToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {tt("confirm_delete_address", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {tt("confirm_delete_address_desc", uiLocale)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAddressToDelete(null)}
                        >
                            {tt("cancel", uiLocale)}
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            {tt("delete", uiLocale)}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
