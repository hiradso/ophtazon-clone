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
import { tt } from "@/lib/i18n";
import { formatPrice, hasDiscount } from "@/lib/pricing";
import { toFa } from "@/lib/toFa";
import { countryLabel } from "@/lib/countries";

export default function Index({ cart, countries, addresses = [], defaultAddress }) {
    const { locale } = usePage().props;
    const items = cart.items;
    const total = items.reduce(
        (sum, item) =>
            sum + Number(item.product.effective_price) * item.quantity,
        0,
    );
    const currency = items[0]?.product.currency ?? "EUR";

    const { data, setData, post, processing, errors } = useForm({
        full_name: defaultAddress?.full_name ?? "",
        phone: defaultAddress?.phone ?? "",
        country_id: defaultAddress ? String(defaultAddress.country_id) : "",
        city: defaultAddress?.city ?? "",
        address_line: defaultAddress?.address_line ?? "",
        postal_code: defaultAddress?.postal_code ?? "",
        payment_method: "online_gateway",
    });

    const fillFromAddress = (addressId) => {
        const address = addresses.find((a) => String(a.id) === addressId);
        if (!address) return;
        setData({
            ...data,
            full_name: address.full_name,
            phone: address.phone,
            country_id: String(address.country_id),
            city: address.city,
            address_line: address.address_line,
            postal_code: address.postal_code ?? "",
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("orders.store", { locale }));
    };

    return (
        <PublicLayout>
            <Head title={tt("checkout", locale)} />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                    {tt("checkout", locale)}
                </h1>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                >
                    {/* ستون چپ: فرم آدرس و پرداخت */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {tt("shipping_details", locale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {addresses.length > 0 && (
                                    <div className="space-y-1.5">
                                        <Label>
                                            {tt(
                                                "use_saved_address",
                                                locale,
                                            )}
                                        </Label>
                                        <Select
                                            onValueChange={fillFromAddress}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue>
                                                    {() =>
                                                        tt(
                                                            "select_saved_address",
                                                            locale,
                                                        )
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {addresses.map((address) => (
                                                    <SelectItem
                                                        key={address.id}
                                                        value={String(
                                                            address.id,
                                                        )}
                                                    >
                                                        {address.full_name} —{" "}
                                                        {address.city}
                                                        {address.is_default
                                                            ? ` (${tt("default_address", locale)})`
                                                            : ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="full_name">
                                            {tt("full_name_field", locale)}
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
                                        <Label htmlFor="phone">
                                            {tt("phone_field", locale)}
                                        </Label>
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
                                    <Label>{tt("country_field", locale)}</Label>
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
                                                        ? countryLabel(
                                                              countries.find(
                                                                  (c) =>
                                                                      String(
                                                                          c.id,
                                                                      ) ===
                                                                      value,
                                                              ),
                                                              locale,
                                                          )
                                                        : tt(
                                                              "select_country",
                                                              locale,
                                                          )
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem
                                                    key={country.id}
                                                    value={String(country.id)}
                                                >
                                                    {countryLabel(
                                                        country,
                                                        locale,
                                                    )}
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
                                        <Label htmlFor="city">
                                            {tt("city_field", locale)}
                                        </Label>
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
                                            {tt("postal_code_field", locale)}{" "}
                                            ({tt("optional", locale)})
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
                                        {tt("address_line_field", locale)}
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
                                <CardTitle>
                                    {tt("payment_method", locale)}
                                </CardTitle>
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
                                                tt(value, locale)
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online_gateway">
                                            {tt("online_gateway", locale)}
                                        </SelectItem>
                                        <SelectItem value="bank_transfer">
                                            {tt("bank_transfer", locale)}
                                        </SelectItem>
                                        <SelectItem value="cash_on_delivery">
                                            {tt("cash_on_delivery", locale)}
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
                                <CardTitle>
                                    {tt("order_summary", locale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {items.map((item) => {
                                        const discounted = hasDiscount(
                                            item.product.discount_percentage,
                                        );
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-start justify-between gap-3 text-sm"
                                            >
                                                <span className="text-muted-foreground">
                                                    {t(
                                                        item.product.title,
                                                        locale,
                                                    )}
                                                    <span className="text-muted-foreground/70">
                                                        {" "}
                                                        ×{" "}
                                                        {toFa(
                                                            item.quantity,
                                                            locale,
                                                        )}
                                                    </span>
                                                </span>
                                                <span className="shrink-0 text-right whitespace-nowrap">
                                                    {discounted && (
                                                        <span className="me-1.5 text-xs text-muted-foreground line-through">
                                                            {formatPrice(
                                                                item.product
                                                                    .price *
                                                                    item.quantity,
                                                                locale,
                                                            )}
                                                        </span>
                                                    )}
                                                    <span className="text-foreground">
                                                        {formatPrice(
                                                            item.product
                                                                .effective_price *
                                                                item.quantity,
                                                            locale,
                                                        )}{" "}
                                                        {item.product.currency}
                                                    </span>
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Separator />

                                <div className="flex justify-between text-base font-semibold text-foreground">
                                    <span>{tt("total_label", locale)}</span>
                                    <span>
                                        {formatPrice(total, locale)} {currency}
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
                                            ? tt("placing_order", locale)
                                            : tt("place_order", locale)}
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
