import { useCurrency } from "@/lib/currency-provider";
import { formatPrice } from "@/lib/pricing";

/**
 * قیمت یک محصول را با نرخ ارز زنده به ارز انتخاب‌شده‌ی کاربر تبدیل
 * و نمایش می‌دهد. برای مبالغ سفارش‌های ثبت‌شده استفاده نشود — آن‌ها
 * باید همیشه ارز و مبلغ اصلی زمان ثبت را نشان بدهند، نه تبدیل‌شده.
 */
export default function Price({ amount, currency, locale, className }) {
    const { convert } = useCurrency();
    const converted = convert(amount, currency);

    return (
        <span className={className}>
            {formatPrice(converted.amount, locale)} {converted.currency}
        </span>
    );
}
