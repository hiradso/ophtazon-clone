import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";

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
        setup: ({ App, props }) => (
            <ThemeProvider>
                <TooltipProvider>
                    <App {...props} />
                </TooltipProvider>
            </ThemeProvider>
        ),
    }),
);
