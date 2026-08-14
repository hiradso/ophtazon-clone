import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { route } from "ziggy-js";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { CurrencyProvider } from "@/lib/currency-provider";

const appName = "Ophtazon";

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob("./Pages/**/*.jsx"),
            ),
        setup: ({ App, props }) => {
            // چون در Node.js تابع route() از طریق Blade تزریق نمی‌شود،
            // اینجا با استفاده از تنظیمات ziggy که از طریق Props اشتراکی
            // Inertia می‌آید، همان تابع را دستی و سراسری فعال می‌کنیم.
            const ziggyConfig = props.initialPage.props.ziggy;
            global.route = (name, params, absolute) =>
                route(name, params, absolute, ziggyConfig);

            return (
                <ThemeProvider>
                    <CurrencyProvider
                        initialExchangeRates={
                            props.initialPage.props.exchangeRates
                        }
                    >
                        <TooltipProvider>
                            <App {...props} />
                        </TooltipProvider>
                    </CurrencyProvider>
                </ThemeProvider>
            );
        },
    }),
);
