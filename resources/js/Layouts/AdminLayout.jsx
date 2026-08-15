import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import ThemeToggle from "@/Components/ThemeToggle";
import CurrencyToggle from "@/Components/CurrencyToggle";
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
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
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
    ShieldCheck,
    Building2,
    ChevronsUpDown,
    ChevronRight,
    LogOut,
    UserRound,
    Mail,
    ClipboardList,
    Users,
    LayoutTemplate,
    ExternalLink,
    FileText,
    Link2,
    Settings,
    Image,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { at } from "@/lib/admin-i18n";
import { switchLocale } from "@/lib/switchLocale";

import { Button } from "@/components/ui/button";
import { toFa } from "@/lib/toFa";

const navItems = [
    {
        labelKey: "dashboard",
        icon: LayoutDashboard,
        routeName: "dashboard",
        pattern: "dashboard",
    },
    {
        labelKey: "orders",
        icon: ClipboardList,
        routeName: "admin.orders.index",
        pattern: "admin.orders.*",
    },
    {
        labelKey: "products",
        icon: Package,
        routeName: "admin.products.index",
        pattern: "admin.products.*",
    },
    {
        labelKey: "categories",
        icon: FolderTree,
        routeName: "admin.categories.index",
        pattern: "admin.categories.*",
    },
    {
        labelKey: "brands",
        icon: Award,
        routeName: "admin.brands.index",
        pattern: "admin.brands.*",
    },
    {
        labelKey: "stores",
        icon: Building2,
        routeName: "admin.stores.index",
        pattern: "admin.stores.*",
    },
    {
        labelKey: "certifications",
        icon: ShieldCheck,
        routeName: "admin.certifications.index",
        pattern: "admin.certifications.*",
    },
    {
        labelKey: "messages",
        icon: Mail,
        routeName: "admin.contact-requests.index",
        pattern: "admin.contact-requests.*",
    },
    {
        labelKey: "users",
        icon: Users,
        routeName: "admin.users.index",
        pattern: "admin.users.*",
    },
    {
        labelKey: "settings",
        icon: Settings,
        routeName: "admin.settings.edit",
        pattern: "admin.settings.*",
    },
];
const siteContentGroup = {
    labelKey: "site_content",
    icon: LayoutTemplate,
    children: [
        {
            labelKey: "homepage",
            icon: LayoutTemplate,
            routeName: "admin.page-sections.index",
            pattern: "admin.page-sections.*",
        },
        {
            labelKey: "pages",
            icon: FileText,
            routeName: "admin.pages.index",
            pattern: "admin.pages.*",
        },
        {
            labelKey: "menu_links",
            icon: Link2,
            routeName: "admin.menu-links.index",
            pattern: "admin.menu-links.*",
        },
        {
            labelKey: "media_library",
            icon: Image,
            routeName: "admin.media.index",
            pattern: "admin.media.*",
        },
    ],
};

export default function AdminLayout({ header, breadcrumbs, children }) {
    const { auth, newContactRequestsCount, locale, siteSettings } =
        usePage().props;
    const user = auth.user;

    const isSiteContentActive = siteContentGroup.children.some((child) =>
        route().current(child.pattern),
    );
    const [siteContentOpen, setSiteContentOpen] = useState(isSiteContentActive);

    return (
        <SidebarProvider dir={locale === "fa" ? "rtl" : "ltr"}>
            <Sidebar
                collapsible="icon"
                side={locale === "fa" ? "right" : "left"}
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                render={<Link href={route("dashboard")} />}
                            >
                                {siteSettings?.logo ? (
                                    <img
                                        src={`/storage/${siteSettings.logo}`}
                                        alt={siteSettings.site_name}
                                        className="size-8 rounded-lg object-contain"
                                    />
                                ) : (
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <span className="text-sm font-bold">
                                            {siteSettings?.site_name?.charAt(
                                                0,
                                            ) ?? "O"}
                                        </span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        {siteSettings?.site_name ?? "Ophtazon"}
                                    </span>
                                    <span className="text-xs text-sidebar-foreground/70">
                                        {at("admin_panel_label", locale)}
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.routeName}>
                                        <SidebarMenuButton
                                            tooltip={at(item.labelKey, locale)}
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
                                            <span>
                                                {at(item.labelKey, locale)}
                                            </span>
                                        </SidebarMenuButton>
                                        {item.routeName ===
                                            "admin.contact-requests.index" &&
                                            newContactRequestsCount > 0 && (
                                                <SidebarMenuBadge className="bg-destructive text-white peer-hover/menu-button:text-white peer-data-active/menu-button:text-white group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:top-0 group-data-[collapsible=icon]:right-0 group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:min-w-3 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:text-[9px] group-data-[collapsible=icon]:leading-none rounded-full">
                                                    {toFa(
                                                        newContactRequestsCount,
                                                        locale,
                                                    )}
                                                </SidebarMenuBadge>
                                            )}
                                    </SidebarMenuItem>
                                ))}

                                {/* منوی والد قابل‌جمع‌شدن: Site Content */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip={at(
                                            siteContentGroup.labelKey,
                                            locale,
                                        )}
                                        isActive={isSiteContentActive}
                                        onClick={() =>
                                            setSiteContentOpen(!siteContentOpen)
                                        }
                                    >
                                        <siteContentGroup.icon />
                                        <span>
                                            {at(
                                                siteContentGroup.labelKey,
                                                locale,
                                            )}
                                        </span>
                                        <ChevronRight
                                            className={`ms-auto size-4 transition-transform ${
                                                siteContentOpen
                                                    ? "rotate-90"
                                                    : "rtl:rotate-180"
                                            }`}
                                        />
                                    </SidebarMenuButton>

                                    <div
                                        className={`grid overflow-hidden transition-all duration-200 ease-in-out ${
                                            siteContentOpen
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <SidebarMenuSub>
                                                {siteContentGroup.children.map(
                                                    (child) => (
                                                        <SidebarMenuSubItem
                                                            key={
                                                                child.routeName
                                                            }
                                                        >
                                                            <SidebarMenuSubButton
                                                                isActive={route().current(
                                                                    child.pattern,
                                                                )}
                                                                render={
                                                                    <Link
                                                                        href={route(
                                                                            child.routeName,
                                                                        )}
                                                                    />
                                                                }
                                                            >
                                                                <child.icon />
                                                                <span>
                                                                    {at(
                                                                        child.labelKey,
                                                                        locale,
                                                                    )}
                                                                </span>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ),
                                                )}
                                            </SidebarMenuSub>
                                        </div>
                                    </div>
                                </SidebarMenuItem>
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
                                            <ChevronsUpDown className="ms-auto size-4" />
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
                                                href={route("profile.edit", {
                                                    locale,
                                                })}
                                            />
                                        }
                                    >
                                        <UserRound className="me-2 size-4" />
                                        {at("profile", locale)}
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
                                        <LogOut className="me-2 size-4" />
                                        {at("log_out", locale)}
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
                    <Separator orientation="vertical" className="me-2 h-4" />

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

                    <div className="ms-auto flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={route("welcome", {
                                                    locale,
                                                })}
                                                target="_blank"
                                            />
                                        }
                                    >
                                        <ExternalLink className="size-4" />
                                    </Button>
                                }
                            />
                            <TooltipContent side="bottom">
                                {at("view_site", locale)}
                            </TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button variant="ghost" size="sm">
                                        {locale === "fr"
                                            ? "FR"
                                            : locale === "fa"
                                              ? "FA"
                                              : "EN"}
                                    </Button>
                                }
                            />
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => switchLocale("en")}
                                >
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => switchLocale("fr")}
                                >
                                    Français
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => switchLocale("fa")}
                                >
                                    فارسی
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ThemeToggle />
                        <CurrencyToggle />
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
                                {at("log_out", locale)}
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
