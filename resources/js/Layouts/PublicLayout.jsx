import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, usePage, router } from "@inertiajs/react";
import ThemeToggle from "@/Components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    ShoppingCart,
    UserRound,
    ImageOff,
    ArrowRight,
    ArrowUp,
    Trash2,
    Minus,
    Plus,
} from "lucide-react";
import Footer from "@/Components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/translate";
import { tt } from "@/lib/i18n";

function formatPrice(price) {
    const num = Number(price);
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}

export default function PublicLayout({ children }) {
    const { auth, cartItemsCount, headerLinks, flash, siteSettings, locale } =
        usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-40 border-b border-border/50 bg-card/70 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route("welcome")}
                        className="flex items-center gap-2 shrink-0"
                    >
                        {siteSettings.logo ? (
                            <img
                                src={`/storage/${siteSettings.logo}`}
                                alt={siteSettings.site_name}
                                className="size-8 rounded-lg object-contain"
                            />
                        ) : (
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <span className="text-sm font-bold">
                                    {siteSettings.site_name?.charAt(0) ?? "O"}
                                </span>
                            </div>
                        )}
                        <span className="text-lg font-semibold tracking-tight text-foreground">
                            {siteSettings.site_name}
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href={route("products.index")}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {tt("products", locale)}
                        </Link>
                        {headerLinks.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {t(link.label, locale)}
                            </a>
                        ))}
                    </nav>

                    <form
                        action={route("products.index")}
                        method="get"
                        className="relative ml-auto hidden max-w-sm flex-1 md:block"
                    >
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            name="q"
                            placeholder={tt("search_placeholder", locale)}
                            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                    </form>

                    <div className="ml-auto flex items-center gap-2 md:ml-0">
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button variant="ghost" size="sm">
                                        {locale === "fr" ? "FR" : "EN"}
                                    </Button>
                                }
                            />
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() =>
                                        router.post(
                                            route("locale.update", "en"),
                                        )
                                    }
                                >
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        router.post(
                                            route("locale.update", "fr"),
                                        )
                                    }
                                >
                                    Français
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <CartHoverPreview
                            cartItemsCount={cartItemsCount}
                            locale={locale}
                        />

                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <Button variant="ghost" size="icon">
                                            <UserRound className="size-4" />
                                        </Button>
                                    }
                                />
                                <DropdownMenuContent align="end">
                                    {(auth.user.role === "admin" ||
                                        auth.user.role === "staff") && (
                                        <DropdownMenuItem
                                            nativeButton={false}
                                            render={
                                                <Link
                                                    href={route("dashboard")}
                                                />
                                            }
                                        >
                                            {tt("admin_panel", locale)}
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={route("profile.edit")}
                                            />
                                        }
                                    >
                                        {tt("profile", locale)}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={route("orders.index")}
                                            />
                                        }
                                    >
                                        {tt("my_orders", locale)}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        nativeButton={true}
                                        render={
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            />
                                        }
                                        variant="destructive"
                                    >
                                        {tt("log_out", locale)}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    nativeButton={false}
                                    render={<Link href={route("login")} />}
                                >
                                    {tt("log_in", locale)}
                                </Button>
                                <Button
                                    size="sm"
                                    nativeButton={false}
                                    render={<Link href={route("register")} />}
                                >
                                    {tt("register", locale)}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <motion.main
                key={usePage().url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="flex-1"
            >
                {children}
            </motion.main>
            <Footer />

            <ScrollToTopButton />
        </div>
    );
}

function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 10 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="fixed right-6 bottom-6 z-40 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="size-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

function CartHoverPreview({ cartItemsCount, locale }) {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [busyId, setBusyId] = useState(null);
    const closeTimeout = useRef(null);

    const fetchPreview = async () => {
        setLoading(true);
        try {
            const res = await fetch(route("cart.preview"));
            const data = await res.json();
            setPreview(data);
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = () => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setOpen(true);
        fetchPreview();
    };

    const handleLeave = () => {
        closeTimeout.current = setTimeout(() => setOpen(false), 200);
    };

    const removeItem = (itemId) => {
        setBusyId(itemId);
        router.delete(route("cart.destroy", itemId), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setBusyId(null);
                fetchPreview();
            },
        });
    };

    const changeQuantity = (item, delta) => {
        const nextQuantity = item.quantity + delta;
        if (nextQuantity < 1 || nextQuantity > item.product.stock_quantity)
            return;

        setBusyId(item.id);
        router.patch(
            route("cart.update", item.id),
            { quantity: nextQuantity },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setBusyId(null);
                    fetchPreview();
                },
            },
        );
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                render={<Link href={route("cart.index")} />}
                className="relative"
            >
                <motion.div
                    key={cartItemsCount}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.3 }}
                >
                    <ShoppingCart className="size-4" />
                </motion.div>
                {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
                        {cartItemsCount}
                    </span>
                )}
            </Button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 z-50 mt-2 w-[30rem] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg"
                    >
                        {loading && !preview ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                Loading...
                            </p>
                        ) : !preview || preview.items.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                Your cart is empty.
                            </p>
                        ) : (
                            <>
                                <div className="max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                                    <table className="w-full table-fixed text-sm">
                                        <colgroup>
                                            <col className="w-9" />
                                            <col />
                                            <col className="w-24" />
                                            <col className="w-20" />
                                            <col className="w-8" />
                                        </colgroup>
                                        <thead>
                                            <tr className="border-b border-border text-[11px] font-medium text-muted-foreground">
                                                <th className="py-2 pl-0.5 text-left"></th>
                                                <th className="py-2 pl-2 text-left">
                                                    Item
                                                </th>
                                                <th className="py-2 text-center">
                                                    Qty
                                                </th>
                                                <th className="py-2 pr-2 text-right">
                                                    Price
                                                </th>
                                                <th className="py-2 pr-0.5 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.items.map((item) => {
                                                const isBusy =
                                                    busyId === item.id;
                                                const atMax =
                                                    item.quantity >=
                                                    item.product.stock_quantity;

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="border-b border-border/60 last:border-0"
                                                    >
                                                        <td
                                                            className="cursor-pointer py-2 pl-0.5"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "products.show",
                                                                        item
                                                                            .product
                                                                            .slug,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <div className="flex size-9 items-center justify-center overflow-hidden rounded-md bg-muted">
                                                                {item.product
                                                                    .image ? (
                                                                    <img
                                                                        src={`/storage/${item.product.image}`}
                                                                        alt=""
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <ImageOff className="size-4 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="cursor-pointer truncate py-2 pr-2 pl-2 text-xs font-normal text-foreground hover:text-primary"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "products.show",
                                                                        item
                                                                            .product
                                                                            .slug,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            {t(
                                                                item.product
                                                                    .title,
                                                                locale,
                                                            )}
                                                        </td>
                                                        <td className="py-2">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        changeQuantity(
                                                                            item,
                                                                            -1,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isBusy ||
                                                                        item.quantity <=
                                                                            1
                                                                    }
                                                                    className="flex size-5 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                                                                >
                                                                    <Minus className="size-2.5" />
                                                                </button>
                                                                <span className="w-4 text-center text-xs text-foreground">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        changeQuantity(
                                                                            item,
                                                                            1,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isBusy ||
                                                                        atMax
                                                                    }
                                                                    className="flex size-5 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                                                                >
                                                                    <Plus className="size-2.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="py-2 pr-2 text-right text-xs font-normal whitespace-nowrap text-foreground">
                                                            {formatPrice(
                                                                item.product
                                                                    .price *
                                                                    item.quantity,
                                                            )}{" "}
                                                            {
                                                                item.product
                                                                    .currency
                                                            }
                                                        </td>
                                                        <td className="py-2 pr-0.5 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        item.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    isBusy
                                                                }
                                                                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {formatPrice(preview.total)}{" "}
                                        {preview.currency}
                                    </span>
                                </div>

                                <Button
                                    className="mt-3 w-full"
                                    size="sm"
                                    nativeButton={false}
                                    render={<Link href={route("cart.index")} />}
                                >
                                    Go to cart
                                    <ArrowRight className="ml-1.5 size-3.5" />
                                </Button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
