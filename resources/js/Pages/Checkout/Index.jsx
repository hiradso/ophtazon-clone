import { Head, useForm, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { t } from "@/lib/translate";

export default function Index({ cart, countries }) {
    const { locale } = usePage().props;
    const items = cart.items;
    const total = items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
    );
    const currency = items[0]?.product.currency ?? "EUR";

    const { data, setData, post, processing, errors } = useForm({
        full_name: "",
        phone: "",
        country_id: "",
        city: "",
        address_line: "",
        postal_code: "",
        payment_method: "bank_transfer",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("orders.store"));
    };

    return (
        <PublicLayout>
            <Head title="Checkout" />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                    Checkout
                </h1>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                >
                    {/* ستون چپ: فرم آدرس و پرداخت */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="full_name">
                                            Full name
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
                                        <Label htmlFor="phone">Phone</Label>
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
                                    <Label>Country</Label>
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
                                                                  String(
                                                                      c.id,
                                                                  ) === value,
                                                          )?.name
                                                        : "Select country"
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
                                        <Label htmlFor="city">City</Label>
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
                                            Postal code (optional)
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
                                        Address
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    value={data.payment_method}
                                    onValueChange={(value) =>
                                        setData("payment_method", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {(value) =>
                                                value === "bank_transfer"
                                                    ? "Bank Transfer"
                                                    : "Cash on Delivery"
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank_transfer">
                                            Bank Transfer
                                        </SelectItem>
                                        <SelectItem value="cash_on_delivery">
                                            Cash on Delivery
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ستون راست: خلاصه سفارش */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Order summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start justify-between gap-3 text-sm"
                                        >
                                            <span className="text-muted-foreground">
                                                {t(item.product.title, locale)}
                                                <span className="text-muted-foreground/70">
                                                    {" "}
                                                    × {item.quantity}
                                                </span>
                                            </span>
                                            <span className="shrink-0 whitespace-nowrap text-foreground">
                                                {(
                                                    item.product.price *
                                                    item.quantity
                                                ).toFixed(2)}{" "}
                                                {item.product.currency}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="flex justify-between text-base font-semibold text-foreground">
                                    <span>Total</span>
                                    <span>
                                        {total.toFixed(2)} {currency}
                                    </span>
                                </div>

                                <motion.div whileTap={{ scale: 0.97 }}>
                                    <Button
                                        type="submit"
                                        className="mt-2 w-full"
                                        size="lg"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Placing order..."
                                            : "Place order"}
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
