import { Link, usePage } from "@inertiajs/react";
import ThemeToggle from "@/Components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, UserRound } from "lucide-react";

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route("welcome")}
                        className="flex items-center gap-2 shrink-0"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-sm font-bold">O</span>
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-foreground">
                            Ophtazon
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href={route("products.index")}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Products
                        </Link>
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

                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="size-4" />
                        </Button>

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

            <main>{children}</main>
        </div>
    );
}
