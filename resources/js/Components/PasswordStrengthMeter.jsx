import { Check, X } from "lucide-react";
import { getPasswordStrength } from "@/lib/passwordStrength";

const BAR_COLOR = {
    weak: "bg-destructive",
    medium: "bg-status-reserved",
    strong: "bg-status-available",
};

const TEXT_COLOR = {
    weak: "text-destructive",
    medium: "text-status-reserved",
    strong: "text-status-available",
};

/**
 * نوار و چک‌لیست قدرت رمز عبور — بدون وابستگی به یک سیستم ترجمه‌ی
 * خاص، برچسب‌ها از بیرون (labels) پاس داده می‌شن تا هم توی صفحات
 * عمومی (tt) و هم توی پنل ادمین (at) قابل استفاده باشه.
 *
 * labels: { length, lower, upper, number, special, weak, medium, strong }
 */
export default function PasswordStrengthMeter({ password, labels }) {
    if (!password) return null;

    const { strength, checks } = getPasswordStrength(password);
    const filledBars = strength === "weak" ? 1 : strength === "medium" ? 2 : 3;

    return (
        <div className="space-y-2.5 rounded-md border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                i < filledBars
                                    ? BAR_COLOR[strength]
                                    : "bg-border"
                            }`}
                        />
                    ))}
                </div>
                <span
                    className={`shrink-0 text-xs font-medium ${TEXT_COLOR[strength]}`}
                >
                    {labels[strength]}
                </span>
            </div>

            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {checks.map((check) => (
                    <li
                        key={check.key}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                            check.met
                                ? "text-status-available"
                                : "text-muted-foreground"
                        }`}
                    >
                        {check.met ? (
                            <Check className="size-3.5 shrink-0" />
                        ) : (
                            <X className="size-3.5 shrink-0 opacity-40" />
                        )}
                        {labels[check.key]}
                    </li>
                ))}
            </ul>
        </div>
    );
}
