import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const STATUS_CONTENT = {
    403: {
        title: "No entry (without the right glasses)",
        message:
            "You don't have permission to view this page. If you think this is a mistake, contact an administrator.",
    },
    404: {
        title: "We looked everywhere — even with a slit lamp",
        message:
            "This page doesn't exist, or it may have been moved, renamed, or sold to another clinic.",
    },
    419: {
        title: "Your session blinked and expired",
        message: "Please refresh the page and try again.",
    },
    429: {
        title: "Slow down a little",
        message:
            "You've made too many requests. Please wait a moment and try again.",
    },
    500: {
        title: "Something fogged up on our end",
        message: "An unexpected error occurred. Our team has been notified.",
    },
    503: {
        title: "Quick maintenance in progress",
        message: "We're tuning a few instruments. Please check back shortly.",
    },
};

export default function Error({ status }) {
    const { locale } = usePage().props ?? {};
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

                <p className="mb-2 text-7xl font-bold tracking-tight text-white sm:text-8xl">
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
                        <ArrowLeft className="mr-1.5 size-4" />
                        Go back
                    </Button>
                    <Button
                        nativeButton={false}
                        render={<Link href="/" />}
                        className="bg-white text-primary hover:bg-white/90"
                    >
                        <Home className="mr-1.5 size-4" />
                        Back to homepage
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
