import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Lock, XCircle } from "lucide-react";
import { tt } from "@/lib/i18n";
import { formatPrice, currencySymbol } from "@/lib/pricing";

function formatCardNumber(value) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

export default function Gateway({ order }) {
    const { locale } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [cvv2, setCvv2] = useState("");

    const submit = (action) => {
        setProcessing(true);
        router.post(
            route("gateway.process", { locale, order: order.id }),
            { action },
            { onFinish: () => setProcessing(false) },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
            <Head title={tt("gateway_title", locale)} />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-sm"
            >
                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Lock className="size-3.5" />
                    {tt("gateway_secure_notice", locale)}
                </div>

                <Card className="overflow-hidden border-0 shadow-xl">
                    <div className="bg-gradient-to-l from-primary to-primary/80 px-6 py-5 text-primary-foreground">
                        <div className="flex items-center justify-between">
                            <ShieldCheck className="size-6" />
                            <span className="text-sm font-semibold tracking-wide">
                                {tt("gateway_mock_bank_name", locale)}
                            </span>
                        </div>
                        <p className="mt-3 text-xs text-primary-foreground/80">
                            {tt("gateway_merchant_label", locale)}: Ophtazon
                        </p>
                    </div>

                    <CardContent className="space-y-5 p-6">
                        <div className="rounded-lg bg-muted/60 p-4 text-center">
                            <p className="text-xs text-muted-foreground">
                                {tt("gateway_amount_label", locale)}
                            </p>
                            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                                {formatPrice(order.total, locale)}{" "}
                                {currencySymbol(order.currency, locale)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {tt("order_number_label", locale)}{" "}
                                {order.order_number}
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                    {tt("gateway_card_number", locale)}
                                </label>
                                <input
                                    dir="ltr"
                                    inputMode="numeric"
                                    placeholder="•••• •••• •••• ••••"
                                    value={cardNumber}
                                    onChange={(e) =>
                                        setCardNumber(
                                            formatCardNumber(e.target.value),
                                        )
                                    }
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-center font-mono text-sm tracking-widest text-foreground shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        {tt("gateway_expiry", locale)}
                                    </label>
                                    <input
                                        dir="ltr"
                                        inputMode="numeric"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-center font-mono text-sm text-foreground shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        {tt("gateway_cvv2", locale)}
                                    </label>
                                    <input
                                        dir="ltr"
                                        inputMode="numeric"
                                        maxLength={4}
                                        placeholder="••••"
                                        value={cvv2}
                                        onChange={(e) =>
                                            setCvv2(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 4),
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-center font-mono text-sm text-foreground shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Button
                                type="button"
                                className="w-full"
                                disabled={processing}
                                onClick={() => submit("approve")}
                            >
                                {tt("gateway_pay_button", locale)}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-muted-foreground"
                                disabled={processing}
                                onClick={() => submit("reject")}
                            >
                                <XCircle className="size-4" />
                                {tt("gateway_cancel_button", locale)}
                            </Button>
                        </div>

                        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                            {tt("gateway_simulation_notice", locale)}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
