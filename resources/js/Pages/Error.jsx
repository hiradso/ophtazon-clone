import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { tt } from "@/lib/i18n";

export default function Error({ status }) {
    const { locale } = usePage().props ?? {};

    const STATUS_CONTENT = {
        403: {
            title: tt("error_403_title", locale),
            message: tt("error_403_message", locale),
        },
        404: {
            title: tt("error_404_title", locale),
            message: tt("error_404_message", locale),
        },
        419: {
            title: tt("error_419_title", locale),
            message: tt("error_419_message", locale),
        },
        429: {
            title: tt("error_429_title", locale),
            message: tt("error_429_message", locale),
        },
        500: {
            title: tt("error_500_title", locale),
            message: tt("error_500_message", locale),
        },
        503: {
            title: tt("error_503_title", locale),
            message: tt("error_503_message", locale),
        },
    };

    const content = STATUS_CONTENT[status] ?? STATUS_CONTENT[404];

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 to-slate-900 px-4 text-center">
            <Head title={`${status} — ${content.title}`} />

            <div
                className="absolute inset-0 opacity-15"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 15% 20%, white 0%, transparent 35%), radial-gradient(circle at 85% 70%, white 0%, transparent 40%)",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* نماد چشم انیمیشن‌دار — که به‌آرومی این‌طرف و اون‌طرف نگاه می‌کند */}
                <div className="relative mb-6 flex size-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-12 text-white"
                    >
                        <path
                            d="M2 12C4.5 6.5 8 4 12 4C16 4 19.5 6.5 22 12C19.5 17.5 16 20 12 20C8 20 4.5 17.5 2 12Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                        />
                        <motion.circle
                            cx="12"
                            cy="12"
                            r="3.2"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            animate={{ cx: [12, 9, 15, 12] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </svg>
                </div>

                <p
                    dir="ltr"
                    className="mb-2 text-7xl font-bold tracking-tight text-white sm:text-8xl"
                >
                    {status}
                </p>

                <h1 className="mb-3 max-w-md text-xl font-semibold text-white sm:text-2xl">
                    {content.title}
                </h1>

                <p className="mb-8 max-w-sm text-sm text-white/70">
                    {content.message}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => window.history.back()}
                    >
                        {locale === "fa" ? (
                            <ArrowRight className="me-1.5 size-4" />
                        ) : (
                            <ArrowLeft className="me-1.5 size-4" />
                        )}
                        {tt("go_back", locale)}
                    </Button>
                    <Button
                        nativeButton={false}
                        render={<Link href={route("welcome", { locale })} />}
                        className="bg-white text-primary hover:bg-white/90"
                    >
                        <Home className="me-1.5 size-4" />
                        {tt("back_to_homepage", locale)}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
