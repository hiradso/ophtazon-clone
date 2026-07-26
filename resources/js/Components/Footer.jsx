import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Footer() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        source: "footer",
    });

    const subscribe = (e) => {
        e.preventDefault();
        post(route("newsletter.store"), {
            preserveScroll: true,
            onSuccess: () => reset("email"),
        });
    };

    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* برند */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <span className="text-sm font-bold">O</span>
                            </div>
                            <span className="text-lg font-semibold text-foreground">
                                Ophtazon
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            New and used ophthalmic equipment, checked and
                            shipped worldwide.
                        </p>
                    </div>

                    {/* لینک‌های سریع */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Marketplace
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href={route("products.index")}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Browse equipment
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("welcome")}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Home
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* حساب کاربری */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Account
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href={route("login")}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Log in
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("register")}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Create account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* خبرنامه */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Stay updated
                        </h3>
                        <p className="mb-3 text-sm text-muted-foreground">
                            New listings and offers, straight to your inbox.
                        </p>
                        <form onSubmit={subscribe} className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-w-28 gap-1.5"
                            >
                                {processing && (
                                    <Loader2 className="size-4 animate-spin" />
                                )}
                                {processing ? "Sending..." : "Join"}
                            </Button>
                        </form>
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Ophtazon. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
}
