import { Head, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { at } from "@/lib/admin-i18n";

const statusColor = {
    pending:
        "bg-status-pending/15 text-status-pending border-status-pending/30",
    paid: "bg-status-reserved/15 text-status-reserved border-status-reserved/30",
    processing:
        "bg-status-reserved/15 text-status-reserved border-status-reserved/30",
    shipped:
        "bg-status-reserved/15 text-status-reserved border-status-reserved/30",
    delivered:
        "bg-status-available/15 text-status-available border-status-available/30",
    cancelled: "bg-muted text-muted-foreground border-border",
};

export default function Index({ orders }) {
    const { locale: uiLocale } = usePage().props;

    const STATUS_LABELS = {
        pending: at("order_status_pending", uiLocale),
        paid: at("order_status_paid", uiLocale),
        processing: at("order_status_processing", uiLocale),
        shipped: at("order_status_shipped", uiLocale),
        delivered: at("order_status_delivered", uiLocale),
        cancelled: at("order_status_cancelled", uiLocale),
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("orders", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("orders", uiLocale)}
                </h2>
            }
        >
            <Head title={at("orders", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <p className="mb-6 text-sm text-muted-foreground">
                        {orders.total}{" "}
                        {orders.total === 1
                            ? at("order_singular", uiLocale)
                            : at("orders_count", uiLocale)}
                    </p>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {at("order_number_col", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("customer", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("store", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("order_total", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("date_col", uiLocale)}
                                        </TableHead>
                                        <TableHead className="w-20"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                {at("no_orders_yet", uiLocale)}
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="align-middle font-medium text-foreground">
                                                {order.order_number}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <p className="text-foreground">
                                                    {order.user?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.user?.email}
                                                </p>
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {order.store?.name}
                                            </TableCell>
                                            <TableCell className="align-middle text-foreground">
                                                {order.total} {order.currency}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        statusColor[
                                                            order.status
                                                        ]
                                                    }
                                                >
                                                    {
                                                        STATUS_LABELS[
                                                            order.status
                                                        ]
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleDateString(
                                                    uiLocale === "fa"
                                                        ? "fa-IR"
                                                        : "en-US",
                                                )}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    nativeButton={false}
                                                    render={
                                                        <Link
                                                            href={route(
                                                                "admin.orders.show",
                                                                order.id,
                                                            )}
                                                        />
                                                    }
                                                >
                                                    {at("view", uiLocale)}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
