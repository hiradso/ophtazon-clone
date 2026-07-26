import { Head, Link } from "@inertiajs/react";
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

const STATUS_LABELS = {
    pending: "Pending",
    paid: "Paid",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

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
    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Orders" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Orders
                </h2>
            }
        >
            <Head title="Orders" />

            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <p className="mb-6 text-sm text-muted-foreground">
                        {orders.total} {orders.total === 1 ? "order" : "orders"}
                    </p>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Store</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
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
                                                No orders yet.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium text-foreground">
                                                {order.order_number}
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-foreground">
                                                    {order.user?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.user?.email}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {order.store?.name}
                                            </TableCell>
                                            <TableCell className="text-foreground">
                                                {order.total} {order.currency}
                                            </TableCell>
                                            <TableCell>
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
                                            <TableCell className="text-muted-foreground">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
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
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {orders.links.length > 3 && (
                        <div className="mt-6 flex flex-wrap gap-1">
                            {orders.links.map((link, index) =>
                                link.url ? (
                                    <Button
                                        key={index}
                                        nativeButton={false}
                                        render={<Link href={link.url} />}
                                        variant={
                                            link.active ? "default" : "ghost"
                                        }
                                        size="sm"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        size="sm"
                                        disabled
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
