import { Head, Link, usePage } from "@inertiajs/react";
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
import { tt } from "@/lib/i18n";
import { toFa } from "@/lib/toFa";
import { formatPrice, currencySymbol } from "@/lib/pricing";

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
    const dateLocale =
        uiLocale === "fa" ? "fa-IR" : uiLocale === "fr" ? "fr-FR" : "en-US";

    return (
        <PublicLayout>
            <Head title={tt("my_orders", uiLocale)} />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                    {tt("my_orders", uiLocale)}
                </h1>

                {orders.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border py-16 text-center">
                        <PackageOpen className="mx-auto mb-3 size-10 text-muted-foreground" />
                        <p className="mb-4 text-sm text-muted-foreground">
                            {tt("no_orders_yet", uiLocale)}
                        </p>
                        <Button
                            nativeButton={false}
                            render={<Link href={route("products.index", { locale: uiLocale })} />}
                        >
                            {tt("browse_equipment", uiLocale)}
                        </Button>
                    </div>
                ) : (
                    <>
                        <Card className="overflow-hidden py-0">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                {tt(
                                                    "order_number_label",
                                                    uiLocale,
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {tt("items_label", uiLocale)}
                                            </TableHead>
                                            <TableHead>
                                                {tt("total_label", uiLocale)}
                                            </TableHead>
                                            <TableHead>
                                                {tt("status_label", uiLocale)}
                                            </TableHead>
                                            <TableHead>
                                                {tt("date_label", uiLocale)}
                                            </TableHead>
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
                                                    {toFa(
                                                        order.items.length,
                                                        uiLocale,
                                                    )}{" "}
                                                    {order.items.length === 1
                                                        ? tt(
                                                              "item_singular",
                                                              uiLocale,
                                                          )
                                                        : tt(
                                                              "items_plural",
                                                              uiLocale,
                                                          )}
                                                </TableCell>
                                                <TableCell className="text-foreground">
                                                    {formatPrice(
                                                        order.total,
                                                        uiLocale,
                                                    )}{" "}
                                                    {currencySymbol(
                                                        order.currency,
                                                        uiLocale,
                                                    )}
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
                                                        {tt(
                                                            `status_${order.status}`,
                                                            uiLocale,
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(
                                                        order.created_at,
                                                    ).toLocaleDateString(
                                                        dateLocale,
                                                    )}
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
                                                        {tt(
                                                            "view_label",
                                                            uiLocale,
                                                        )}
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
