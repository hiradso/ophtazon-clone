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
import { ArrowLeft } from "lucide-react";

const STATUS_LABELS = {
    pending: "Pending",
    paid: "Paid",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

export default function Show({ order }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing } = useForm({
        status: order.status,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.orders.update", order.id));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Orders", href: route("admin.orders.index") },
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
                        <ArrowLeft className="size-4" />
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
                                    <CardTitle>Items</CardTitle>
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
                                                    Ref:{" "}
                                                    {
                                                        item.product_reference_snapshot
                                                    }{" "}
                                                    · Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-foreground">
                                                {(
                                                    item.unit_price *
                                                    item.quantity
                                                ).toFixed(2)}{" "}
                                                {order.currency}
                                            </p>
                                        </div>
                                    ))}

                                    <Separator />

                                    <div className="flex justify-between font-semibold text-foreground">
                                        <span>Total</span>
                                        <span>
                                            {order.total} {order.currency}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping address</CardTitle>
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
                                    <CardTitle>Customer</CardTitle>
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
                                    <CardTitle>Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={submit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <Label>Order status</Label>
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
                                                        Pending
                                                    </SelectItem>
                                                    <SelectItem value="paid">
                                                        Paid
                                                    </SelectItem>
                                                    <SelectItem value="processing">
                                                        Processing
                                                    </SelectItem>
                                                    <SelectItem value="shipped">
                                                        Shipped
                                                    </SelectItem>
                                                    <SelectItem value="delivered">
                                                        Delivered
                                                    </SelectItem>
                                                    <SelectItem value="cancelled">
                                                        Cancelled
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Saving..."
                                                : "Update status"}
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
