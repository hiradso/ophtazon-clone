import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
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
import { PackageOpen } from "lucide-react";

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
        <PublicLayout>
            <Head title="My Orders" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                    My Orders
                </h1>

                {orders.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border py-16 text-center">
                        <PackageOpen className="mx-auto mb-3 size-10 text-muted-foreground" />
                        <p className="mb-4 text-sm text-muted-foreground">
                            You haven't placed any orders yet.
                        </p>
                        <Button
                            nativeButton={false}
                            render={<Link href={route("products.index")} />}
                        >
                            Browse equipment
                        </Button>
                    </div>
                ) : (
                    <>
                        <Card className="overflow-hidden py-0">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="w-20"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.data.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium text-foreground">
                                                    {order.order_number}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {order.items.length}{" "}
                                                    {order.items.length === 1
                                                        ? "item"
                                                        : "items"}
                                                </TableCell>
                                                <TableCell className="text-foreground">
                                                    {order.total}{" "}
                                                    {order.currency}
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
                                                                    "orders.show",
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
                                                link.active
                                                    ? "default"
                                                    : "ghost"
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
                    </>
                )}
            </div>
        </PublicLayout>
    );
}
