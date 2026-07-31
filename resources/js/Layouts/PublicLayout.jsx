import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, usePage } from "@inertiajs/react";
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
} from "lucide-react";
import Footer from "@/Components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicLayout({ children }) {
    const { auth, cartItemsCount, headerLinks, flash, siteSettings } =
        usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="border-b border-border bg-card">
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
                            Products
                        </Link>
                        {headerLinks.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
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
                            placeholder="Search equipment..."
                            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                    </form>

                    <div className="ml-auto flex items-center gap-2 md:ml-0">
                        <ThemeToggle />

                        <CartHoverPreview cartItemsCount={cartItemsCount} />

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
                                            Admin Panel
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
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={route("orders.index")}
                                            />
                                        }
                                    >
                                        My Orders
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
                                        Log Out
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
                                    Log in
                                </Button>
                                <Button
                                    size="sm"
                                    nativeButton={false}
                                    render={<Link href={route("register")} />}
                                >
                                    Register
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
        </div>
    );
}

function CartHoverPreview({ cartItemsCount }) {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
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
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
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
                        className="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg"
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
                                <div className="max-h-72 space-y-3 overflow-y-auto">
                                    {preview.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                                {item.product.image ? (
                                                    <img
                                                        src={`/storage/${item.product.image}`}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageOff className="size-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {item.product.title.en}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-sm font-semibold text-foreground">
                                                {item.product.price}{" "}
                                                {item.product.currency}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {preview.total.toFixed(2)}{" "}
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
