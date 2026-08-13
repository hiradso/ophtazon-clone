import {
    Receipt,
    CreditCard,
    PackageSearch,
    Truck,
    PartyPopper,
    XCircle,
} from "lucide-react";
import { tt } from "@/lib/i18n";

const STEPS = [
    { key: "pending", icon: Receipt, hue: 25 },
    { key: "paid", icon: CreditCard, hue: 50 },
    { key: "processing", icon: PackageSearch, hue: 85 },
    { key: "shipped", icon: Truck, hue: 120 },
    { key: "delivered", icon: PartyPopper, hue: 155 },
];

const stepColor = (hue) => `oklch(0.7 0.17 ${hue})`;

/**
 * نوار پیشرفت وضعیت سفارش — طیف رنگی از قرمز (تازه ثبت‌شده) تا سبز
 * (تحویل داده‌شده)، هر مرحله با آیکون مخصوص خودش. اگر سفارش لغو شده
 * باشد، به‌جای نوار پیشرفت یه بنر جدا نشون داده می‌شه چون «لغو شده»
 * بخشی از مسیر طبیعی پیشرفت نیست.
 */
export default function OrderProgressBar({ status, locale }) {
    if (status === "cancelled") {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                <XCircle className="size-6 shrink-0 text-destructive" />
                <div>
                    <p className="font-medium text-destructive">
                        {tt("status_cancelled", locale)}
                    </p>
                    <p className="text-sm text-destructive/80">
                        {tt("order_cancelled_desc", locale)}
                    </p>
                </div>
            </div>
        );
    }

    const currentIndex = STEPS.findIndex((s) => s.key === status);

    return (
        <div className="w-full py-2">
            <div className="flex items-start">
                {STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const reached = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const color = stepColor(step.hue);

                    return (
                        <div
                            key={step.key}
                            className="flex flex-1 flex-col items-center last:flex-none"
                        >
                            <div className="flex w-full items-center">
                                {index > 0 && (
                                    <div
                                        className="h-0.5 flex-1 transition-colors duration-500"
                                        style={{
                                            backgroundColor: reached
                                                ? stepColor(
                                                      STEPS[index - 1].hue,
                                                  )
                                                : "var(--border)",
                                        }}
                                    />
                                )}
                                <div
                                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                        isCurrent
                                            ? "scale-110 shadow-lg"
                                            : ""
                                    }`}
                                    style={{
                                        backgroundColor: reached
                                            ? color
                                            : "var(--muted)",
                                        borderColor: reached
                                            ? color
                                            : "var(--border)",
                                        boxShadow: isCurrent
                                            ? `0 0 0 4px color-mix(in oklch, ${color} 25%, transparent)`
                                            : undefined,
                                    }}
                                >
                                    <Icon
                                        className={`size-4 ${
                                            reached
                                                ? "text-white"
                                                : "text-muted-foreground"
                                        }`}
                                    />
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className="h-0.5 flex-1 transition-colors duration-500"
                                        style={{
                                            backgroundColor:
                                                index < currentIndex
                                                    ? color
                                                    : "var(--border)",
                                        }}
                                    />
                                )}
                            </div>
                            <span
                                className={`mt-2 max-w-[4.5rem] text-center text-[11px] leading-tight ${
                                    reached
                                        ? "font-medium text-foreground"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {tt(`status_${step.key}`, locale)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
