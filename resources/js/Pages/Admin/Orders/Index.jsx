import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { formatPrice } from "@/lib/pricing";
import { toFa } from "@/lib/toFa";

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

export default function Index({ orders, filters }) {
    const { locale: uiLocale } = usePage().props;

    const STATUS_LABELS = {
        pending: at("order_status_pending", uiLocale),
        paid: at("order_status_paid", uiLocale),
        processing: at("order_status_processing", uiLocale),
        shipped: at("order_status_shipped", uiLocale),
        delivered: at("order_status_delivered", uiLocale),
        cancelled: at("order_status_cancelled", uiLocale),
    };

    const PAYMENT_METHOD_LABELS = {
        online_gateway: at("payment_method_online_gateway", uiLocale),
        bank_transfer: at("payment_method_bank_transfer", uiLocale),
        cash_on_delivery: at("payment_method_cash_on_delivery", uiLocale),
    };

    const [localFilters, setLocalFilters] = useState({
        status: filters.status ?? "",
        payment_method: filters.payment_method ?? "",
        date_from: filters.date_from ?? "",
        date_to: filters.date_to ?? "",
        q: filters.q ?? "",
    });

    const applyFilters = (overrides = {}) => {
        const next = { ...localFilters, ...overrides };
        setLocalFilters(next);
        router.get(route("admin.orders.index"), next, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const empty = {
            status: "",
            payment_method: "",
            date_from: "",
            date_to: "",
            q: "",
        };
        setLocalFilters(empty);
        router.get(route("admin.orders.index"), {}, { preserveState: true });
    };

    const hasActiveFilters = Object.values(filters).some((value) => value);

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
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <Input
                            placeholder={at(
                                "search_orders_placeholder",
                                uiLocale,
                            )}
                            className="w-64"
                            value={localFilters.q}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    q: e.target.value,
                                })
                            }
                            onBlur={() => applyFilters()}
                            onKeyDown={(e) =>
                                e.key === "Enter" && applyFilters()
                            }
                        />

                        <Select
                            value={localFilters.status}
                            onValueChange={(value) =>
                                applyFilters({ status: value })
                            }
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue>
                                    {(value) =>
                                        value
                                            ? STATUS_LABELS[value]
                                            : at("all_statuses", uiLocale)
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(STATUS_LABELS).map(
                                    ([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        <Select
                            value={localFilters.payment_method}
                            onValueChange={(value) =>
                                applyFilters({ payment_method: value })
                            }
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue>
                                    {(value) =>
                                        value
                                            ? PAYMENT_METHOD_LABELS[value]
                                            : at(
                                                  "all_payment_methods",
                                                  uiLocale,
                                              )
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(PAYMENT_METHOD_LABELS).map(
                                    ([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1.5">
                            <Input
                                type="date"
                                className="w-40"
                                value={localFilters.date_from}
                                onChange={(e) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        date_from: e.target.value,
                                    })
                                }
                                onBlur={() => applyFilters()}
                            />
                            <span className="text-muted-foreground">–</span>
                            <Input
                                type="date"
                                className="w-40"
                                value={localFilters.date_to}
                                onChange={(e) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        date_to: e.target.value,
                                    })
                                }
                                onBlur={() => applyFilters()}
                            />
                        </div>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                            >
                                <X className="me-1.5 size-3.5" />
                                {at("clear_filters", uiLocale)}
                            </Button>
                        )}
                    </div>

                    <p className="mb-6 text-sm text-muted-foreground">
                        {toFa(orders.total, uiLocale)}{" "}
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
                                            {at(
                                                "payment_method_col",
                                                uiLocale,
                                            )}
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
                                                colSpan={8}
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
                                                {formatPrice(
                                                    order.total,
                                                    uiLocale,
                                                )}{" "}
                                                {order.currency}
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {
                                                    PAYMENT_METHOD_LABELS[
                                                        order.payment_method
                                                    ]
                                                }
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
