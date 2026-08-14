import "../css/app.css";
import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme-provider";
import { CurrencyProvider } from "@/lib/currency-provider";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider>
                <CurrencyProvider
                    initialExchangeRates={
                        props.initialPage.props.exchangeRates
                    }
                >
                    <TooltipProvider>
                        <App {...props} />
                        <Toaster position="top-right" richColors />
                    </TooltipProvider>
                </CurrencyProvider>
            </ThemeProvider>,
        );
        window.dispatchEvent(new Event("app:mounted"));
    },
    progress: {
        color: "#0f766e",
    },
});
