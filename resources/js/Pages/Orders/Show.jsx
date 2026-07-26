import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";

export default function Show({ order }) {
    return (
        <PublicLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-5 text-center">
                    <CheckCircle2 className="mx-auto mb-4 size-12 text-status-available" />
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Order placed successfully
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Order number: {order.order_number}
                    </p>
                </div>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-muted-foreground">
                                    {item.product_title_snapshot.en} ×{" "}
                                    {item.quantity}
                                </span>
                                <span className="text-foreground">
                                    {(item.unit_price * item.quantity).toFixed(
                                        2,
                                    )}{" "}
                                    {order.currency}
                                </span>
                            </div>
                        ))}

                        <Separator />

                        <div className="flex justify-between font-semibold text-foreground">
                            <span>Total</span>
                            <span>
                                {order.total} {order.currency}
                            </span>
                        </div>

                        <Separator />

                        <div className="text-sm">
                            <p className="text-muted-foreground">Shipping to</p>
                            <p className="font-medium text-foreground">
                                {order.shipping_address?.full_name}
                            </p>
                            <p className="text-muted-foreground">
                                {order.shipping_address?.address_line},{" "}
                                {order.shipping_address?.city}
                                {order.shipping_address?.country?.name &&
                                    `, ${order.shipping_address.country.name}`}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <Button
                        nativeButton={false}
                        render={<Link href={route("products.index")} />}
                    >
                        Continue shopping
                    </Button>
                </div>
            </div>
        </PublicLayout>
    );
}
