import { useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { t } from "@/lib/translate";
import { tt } from "@/lib/i18n";
import { toFa } from "@/lib/toFa";
import { formatPrice, currencySymbol } from "@/lib/pricing";
import { countryLabel } from "@/lib/countries";
import OrderProgressBar from "@/Components/OrderProgressBar";

export default function Show({ order }) {
    const { locale, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(tt(flash.success, locale));
        if (flash?.error) toast.error(tt(flash.error, locale));
    }, [flash]);

    // در حالی که سفارش هنوز به مرحله‌ی نهایی (تحویل‌شده/لغوشده) نرسیده،
    // هر چند ثانیه فقط prop سفارش را دوباره می‌گیریم تا اگر ادمین وضعیتش
    // را عوض کرد، کاربر بدون رفرش دستی ببیندش.
    useEffect(() => {
        if (order.status === "delivered" || order.status === "cancelled") {
            return;
        }

        const interval = setInterval(() => {
            router.reload({ only: ["order"] });
        }, 8000);

        return () => clearInterval(interval);
    }, [order.status]);

    return (
        <PublicLayout>
            <Head title={`${tt("order_number_label", locale)} ${order.order_number}`} />
            <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-5 text-center">
                    <CheckCircle2 className="mx-auto mb-4 size-12 text-status-available" />
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {tt("order_placed_success", locale)}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {tt("order_number_prefix", locale)}{" "}
                        {order.order_number}
                    </p>
                </div>

                <Card className="mb-5">
                    <CardContent className="p-6">
                        <OrderProgressBar
                            status={order.status}
                            locale={locale}
                        />
                        {order.status === "pending" &&
                            order.payment_method === "online_gateway" && (
                                <div className="mt-4 flex justify-center">
                                    <Button
                                        size="sm"
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={route("gateway.show", {
                                                    locale,
                                                    order: order.id,
                                                })}
                                            />
                                        }
                                    >
                                        {tt("complete_payment", locale)}
                                    </Button>
                                </div>
                            )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-muted-foreground">
                                    {t(item.product_title_snapshot, locale)} ×{" "}
                                    {toFa(item.quantity, locale)}
                                </span>
                                <span className="text-foreground">
                                    {formatPrice(
                                        item.unit_price * item.quantity,
                                        locale,
                                    )}{" "}
                                    {currencySymbol(order.currency, locale)}
                                </span>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-semibold text-foreground">
                            <span>{tt("total_label", locale)}</span>
                            <span>
                                {formatPrice(order.total, locale)}{" "}
                                {currencySymbol(order.currency, locale)}
                            </span>
                        </div>
                        <Separator />
                        <div className="text-sm">
                            <p className="text-muted-foreground">
                                {tt("shipping_to", locale)}
                            </p>
                            <p className="font-medium text-foreground">
                                {order.shipping_address?.full_name}
                            </p>
                            <p className="text-muted-foreground">
                                {order.shipping_address?.address_line},{" "}
                                {order.shipping_address?.city}
                                {order.shipping_address?.country &&
                                    `, ${countryLabel(order.shipping_address.country, locale)}`}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-6 text-center">
                    <Button
                        nativeButton={false}
                        render={<Link href={route("products.index", { locale })} />}
                    >
                        {tt("continue_shopping", locale)}
                    </Button>
                </div>
            </div>
        </PublicLayout>
    );
}
