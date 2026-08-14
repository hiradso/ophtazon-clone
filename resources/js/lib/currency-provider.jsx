import { createContext, useContext, useEffect, useState } from "react";
import { router } from "@inertiajs/react";

const CurrencyContext = createContext(null);

const DEFAULT_CURRENCY = "USD";

// چون ممکن است هم در مرورگر هم حین SSR (Node) اجرا شود، دسترسی به
// localStorage باید محافظت‌شده باشد.
function getInitialCurrency() {
    if (typeof window === "undefined") {
        return DEFAULT_CURRENCY;
    }
    return localStorage.getItem("currency") || DEFAULT_CURRENCY;
}

/**
 * برخلاف بقیه‌ی Provider های این پروژه، این یکی usePage() صدا نمی‌زند —
 * چون باید بیرون از <App/> (دور کل درخت، مثل ThemeProvider) قرار بگیرد
 * تا حتی خودِ کامپوننت‌های صفحه (نه فقط فرزندهای Layout) هم بتوانند
 * useCurrency() را در بدنه‌ی رندر خودشان صدا بزنند. نرخ‌ها یک‌بار در
 * app.jsx/ssr.jsx از initialPage.props گرفته و به‌عنوان prop تزریق
 * می‌شوند، و بعد با گوش‌دادن به رویداد ناوبری Inertia (نه Context) در
 * هر تغییر صفحه به‌روز می‌مانند.
 */
export function CurrencyProvider({ initialExchangeRates, children }) {
    const [currency, setCurrencyState] = useState(getInitialCurrency);
    const [exchangeRates, setExchangeRates] = useState(
        initialExchangeRates ?? {},
    );

    useEffect(() => {
        return router.on("success", (event) => {
            const rates = event.detail.page.props.exchangeRates;
            if (rates) {
                setExchangeRates(rates);
            }
        });
    }, []);

    const availableCurrencies = Object.keys(exchangeRates ?? {});
    const effectiveCurrency = availableCurrencies.includes(currency)
        ? currency
        : DEFAULT_CURRENCY;

    const setCurrency = (newCurrency) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("currency", newCurrency);
        }
        setCurrencyState(newCurrency);
    };

    /**
     * تبدیل عمومی بین هر دو ارزی که نرخشان موجود باشد (نه فقط به ارز
     * نمایشی فعلی) — برای مواردی مثل فیلتر قیمت لازم است که باید
     * برعکس تبدیل بشه: از ارز نمایشی کاربر به ارز پایه‌ی محصولات (EUR)
     * که بک‌اند باهاش فیلتر می‌کنه.
     */
    const convertBetween = (amount, fromCurrency, toCurrency) => {
        const rates = exchangeRates ?? {};
        const from = rates[fromCurrency];
        const to = rates[toCurrency];

        if (!from || !to || !amount) {
            return { amount: Number(amount) || 0, currency: fromCurrency };
        }

        const amountInUsd = Number(amount) / from;
        const converted = amountInUsd * to;

        // تومان همیشه به‌صورت عدد صحیح — کسری از تومان جایی استفاده نمی‌شه.
        return {
            amount: toCurrency === "IRT" ? Math.round(converted) : converted,
            currency: toCurrency,
        };
    };

    /**
     * مبلغی به ارز مبدأ محصول را به ارز نمایشی انتخاب‌شده‌ی کاربر
     * تبدیل می‌کند. اگر نرخ یکی از دو ارز در دسترس نباشد، همان مبلغ
     * اصلی بدون تبدیل برگردانده می‌شود (بهتر از کرش یا NaN).
     */
    const convert = (amount, fromCurrency) =>
        convertBetween(amount, fromCurrency, effectiveCurrency);

    return (
        <CurrencyContext.Provider
            value={{
                currency: effectiveCurrency,
                setCurrency,
                availableCurrencies,
                convert,
                convertBetween,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
