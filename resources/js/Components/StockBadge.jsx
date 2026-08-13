import { Flame, CheckCircle2 } from "lucide-react";
import { tt } from "@/lib/i18n";
import { toFa } from "@/lib/toFa";

const LOW_STOCK_THRESHOLD = 5;

/**
 * نشان کوچک وضعیت موجودی برای کارت‌های محصول — سه حالت: ناموجود،
 * رو به اتمام (با عدد دقیق)، موجود. compact برای کارت‌های فشرده
 * (کاروسل‌ها) از فونت کوچک‌تر و بدون آیکون استفاده می‌کند.
 */
export default function StockBadge({ stock, locale, compact = false }) {
    const quantity = stock ?? 0;
    const isLowStock = quantity > 0 && quantity <= LOW_STOCK_THRESHOLD;
    const textSize = compact ? "text-[11px]" : "text-xs";

    if (quantity === 0) {
        return (
            <p className={`${textSize} font-medium text-muted-foreground`}>
                {tt("out_of_stock", locale)}
            </p>
        );
    }

    if (isLowStock) {
        return (
            <p
                className={`flex items-center gap-1 ${textSize} font-medium text-status-pending`}
            >
                {!compact && <Flame className="size-3" />}
                {quantity === 1
                    ? tt("last_one_available", locale)
                    : `${tt("low_stock_prefix", locale)} ${toFa(quantity, locale)} ${tt("low_stock_suffix", locale)}`}
            </p>
        );
    }

    return (
        <p
            className={`flex items-center gap-1 ${textSize} font-medium text-status-available`}
        >
            {!compact && <CheckCircle2 className="size-3" />}
            {tt("in_stock", locale)}
        </p>
    );
}
