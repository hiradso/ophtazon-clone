import { Link, usePage } from "@inertiajs/react";
import ThemeToggle from "@/Components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Award,
    Building2,
    ChevronsUpDown,
    LogOut,
    UserRound,
    Mail,
    ClipboardList,
    Users,
    LayoutTemplate,
    ExternalLink,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const navItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        routeName: "dashboard",
        pattern: "dashboard",
    },
    {
        label: "Orders",
        icon: ClipboardList,
        routeName: "admin.orders.index",
        pattern: "admin.orders.*",
    },
    {
        label: "Products",
        icon: Package,
        routeName: "admin.products.index",
        pattern: "admin.products.*",
    },
    {
        label: "Categories",
        icon: FolderTree,
        routeName: "admin.categories.index",
        pattern: "admin.categories.*",
    },
    {
        label: "Brands",
        icon: Award,
        routeName: "admin.brands.index",
        pattern: "admin.brands.*",
    },
    {
        label: "Stores",
        icon: Building2,
        routeName: "admin.stores.index",
        pattern: "admin.stores.*",
    },
    {
        label: "Messages",
        icon: Mail,
        routeName: "admin.contact-requests.index",
        pattern: "admin.contact-requests.*",
    },
    {
        label: "Users",
        icon: Users,
        routeName: "admin.users.index",
        pattern: "admin.users.*",
    },
    {
        label: "Homepage",
        icon: LayoutTemplate,
        routeName: "admin.page-sections.index",
        pattern: "admin.page-sections.*",
    },
];

export default function AdminLayout({ header, breadcrumbs, children }) {
    const { auth, newContactRequestsCount } = usePage().props;
    const user = auth.user;

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                render={<Link href={route("dashboard")} />}
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <span className="text-sm font-bold">O</span>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        Ophtazon
                                    </span>
                                    <span className="text-xs text-sidebar-foreground/70">
                                        Admin Panel
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Catalog</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.routeName}>
                                        <SidebarMenuButton
                                            tooltip={item.label}
                                            isActive={route().current(
                                                item.pattern,
                                            )}
                                            render={
                                                <Link
                                                    href={route(item.routeName)}
                                                />
                                            }
                                        >
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                        {item.routeName ===
                                            "admin.contact-requests.index" &&
                                            newContactRequestsCount > 0 && (
                                                <SidebarMenuBadge className="bg-destructive text-destructive-foreground group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:top-0 group-data-[collapsible=icon]:right-0 group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:min-w-3 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:text-[9px] group-data-[collapsible=icon]:leading-none">
                                                    {newContactRequestsCount}
                                                </SidebarMenuBadge>
                                            )}
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <SidebarMenuButton size="lg">
                                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                                                <UserRound className="size-4" />
                                            </div>
                                            <div className="flex flex-col gap-0.5 leading-none text-left">
                                                <span className="font-medium">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-sidebar-foreground/70">
                                                    {user.email}
                                                </span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto size-4" />
                                        </SidebarMenuButton>
                                    }
                                />
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuItem
                                        render={
                                            <Link
                                                href={route("profile.edit")}
                                            />
                                        }
                                    >
                                        <UserRound className="mr-2 size-4" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        render={
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            />
                                        }
                                        variant="destructive"
                                        nativeButton={true}
                                    >
                                        <LogOut className="mr-2 size-4" />
                                        Log Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((crumb, index) => {
                                    const isLast =
                                        index === breadcrumbs.length - 1;

                                    return (
                                        <span key={index} className="contents">
                                            <BreadcrumbItem>
                                                {isLast || !crumb.href ? (
                                                    <BreadcrumbPage>
                                                        {crumb.label}
                                                    </BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink
                                                        render={
                                                            <Link
                                                                href={
                                                                    crumb.href
                                                                }
                                                            />
                                                        }
                                                    >
                                                        {crumb.label}
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {!isLast && <BreadcrumbSeparator />}
                                        </span>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    )}

                    <div className="ml-auto flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={route("welcome")}
                                                target="_blank"
                                            />
                                        }
                                    >
                                        <ExternalLink className="size-4" />
                                    </Button>
                                }
                            />
                            <TooltipContent side="bottom">
                                View site
                            </TooltipContent>
                        </Tooltip>

                        <ThemeToggle />
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        render={
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            />
                                        }
                                    >
                                        <LogOut className="size-4" />
                                    </Button>
                                }
                            />
                            <TooltipContent side="bottom">
                                Log out
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </header>

                {header && (
                    <div className="border-b border-border bg-card px-4 py-4 sm:px-6">
                        {header}
                    </div>
                )}

                <div className="flex-1">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
