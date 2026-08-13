import { useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { toFa } from "@/lib/toFa";
import { formatPrice } from "@/lib/pricing";

export default function Show({ order }) {
    const { flash, locale: uiLocale } = usePage().props;

    const STATUS_LABELS = {
        pending: at("order_status_pending", uiLocale),
        paid: at("order_status_paid", uiLocale),
        processing: at("order_status_processing", uiLocale),
        shipped: at("order_status_shipped", uiLocale),
        delivered: at("order_status_delivered", uiLocale),
        cancelled: at("order_status_cancelled", uiLocale),
    };

    const { data, setData, put, processing } = useForm({
        status: order.status,
    });

    useEffect(() => {
        if (flash?.success) toast.success(at(flash.success, uiLocale));
        if (flash?.error) toast.error(at(flash.error, uiLocale));
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.orders.update", order.id));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                {
                    label: at("orders", uiLocale),
                    href: route("admin.orders.index"),
                },
                { label: order.order_number },
            ]}
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link href={route("admin.orders.index")} />}
                    >
                        {uiLocale === "fa" ? (
                            <ArrowRight className="size-4" />
                        ) : (
                            <ArrowLeft className="size-4" />
                        )}
                    </Button>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {order.order_number}
                    </h2>
                </div>
            }
        >
            <Head title={order.order_number} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {at("items", uiLocale)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between text-sm"
                                        >
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {
                                                        item
                                                            .product_title_snapshot
                                                            ?.en
                                                    }
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {at("reference", uiLocale)}:{" "}
                                                    {
                                                        item.product_reference_snapshot
                                                    }{" "}
                                                    ·{" "}
                                                    {at("qty_short", uiLocale)}:{" "}
                                                    {toFa(
                                                        item.quantity,
                                                        uiLocale,
                                                    )}
                                                </p>
                                            </div>
                                            <p className="text-foreground">
                                                {formatPrice(
                                                    item.unit_price *
                                                        item.quantity,
                                                    uiLocale,
                                                )}{" "}
                                                {order.currency}
                                            </p>
                                        </div>
                                    ))}

                                    <Separator />

                                    <div className="flex justify-between font-semibold text-foreground">
                                        <span>
                                            {at("order_total", uiLocale)}
                                        </span>
                                        <span>
                                            {formatPrice(
                                                order.total,
                                                uiLocale,
                                            )}{" "}
                                            {order.currency}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {at("shipping_address_title", uiLocale)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <p className="font-medium text-foreground">
                                        {order.shipping_address?.full_name}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {order.shipping_address?.phone}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {order.shipping_address?.address_line},{" "}
                                        {order.shipping_address?.city}
                                        {order.shipping_address?.country
                                            ?.name &&
                                            `, ${order.shipping_address.country.name}`}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {at("customer", uiLocale)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <p className="font-medium text-foreground">
                                        {order.user?.name}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {order.user?.email}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {at("status", uiLocale)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={submit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <Label>
                                                {at("order_status", uiLocale)}
                                            </Label>
                                            <Select
                                                value={data.status}
                                                onValueChange={(value) =>
                                                    setData("status", value)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue>
                                                        {(value) =>
                                                            STATUS_LABELS[value]
                                                        }
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">
                                                        {at(
                                                            "order_status_pending",
                                                            uiLocale,
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="paid">
                                                        {at(
                                                            "order_status_paid",
                                                            uiLocale,
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="processing">
                                                        {at(
                                                            "order_status_processing",
                                                            uiLocale,
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="shipped">
                                                        {at(
                                                            "order_status_shipped",
                                                            uiLocale,
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="delivered">
                                                        {at(
                                                            "order_status_delivered",
                                                            uiLocale,
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="cancelled">
                                                        {at(
                                                            "order_status_cancelled",
                                                            uiLocale,
                                                        )}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full"
                                        >
                                            {processing
                                                ? at("saving", uiLocale)
                                                : at("save_changes", uiLocale)}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
