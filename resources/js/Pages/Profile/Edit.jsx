import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { tt } from "@/lib/i18n";
import { toFa } from "@/lib/toFa";
import {
    LayoutDashboard,
    UserRound,
    ShoppingBag,
    CalendarDays,
    MapPin,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Edit({ mustVerifyEmail, status, ordersCount }) {
    const { auth, locale: uiLocale } = usePage().props;
    const isStaffOrAdmin =
        auth.user.role === "admin" || auth.user.role === "staff";

    const memberSince = new Date(auth.user.created_at).toLocaleDateString(
        uiLocale === "fa" ? "fa-IR" : uiLocale === "fr" ? "fr-FR" : "en-US",
        { year: "numeric", month: "long" },
    );

    return (
        <PublicLayout>
            <Head title={tt("profile", uiLocale)} />
            <div className="py-12">
                <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* پیام خوش‌آمدگویی */}
                    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <UserRound className="size-7 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                                    {tt("welcome_back", uiLocale)},{" "}
                                    {auth.user.name}
                                </h1>
                                <p className="truncate text-sm text-muted-foreground">
                                    {auth.user.email}
                                </p>
                            </div>
                        </div>

                        {isStaffOrAdmin && (
                            <Button
                                variant="outline"
                                size="sm"
                                nativeButton={false}
                                render={<Link href={route("dashboard")} />}
                                className="shrink-0"
                            >
                                <LayoutDashboard className="me-1.5 size-4" />
                                {tt("dashboard", uiLocale)}
                            </Button>
                        )}
                    </div>

                    {/* کارت‌های آماری و دسترسی سریع */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <Link
                            href={route("orders.index", { locale: uiLocale })}
                            className="group block"
                        >
                            <Card className="h-full transition-colors group-hover:border-primary/40">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-status-reserved/10">
                                        <ShoppingBag className="size-5 text-status-reserved" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            {tt("total_orders", uiLocale)}
                                        </p>
                                        <p className="text-xl font-semibold tracking-tight text-foreground">
                                            {toFa(ordersCount, uiLocale)}
                                        </p>
                                    </div>
                                    <ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" />
                                </CardContent>
                            </Card>
                        </Link>

                        <Link
                            href={route("addresses.index", { locale: uiLocale })}
                            className="group block"
                        >
                            <Card className="h-full transition-colors group-hover:border-primary/40">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-status-available/10">
                                        <MapPin className="size-5 text-status-available" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            {tt("addresses", uiLocale)}
                                        </p>
                                    </div>
                                    <ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" />
                                </CardContent>
                            </Card>
                        </Link>

                        <Card className="h-full">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <CalendarDays className="size-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        {tt("member_since", uiLocale)}
                                    </p>
                                    <p className="text-xl font-semibold tracking-tight text-foreground">
                                        {memberSince}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                    <div className="rounded-lg border border-destructive/30 bg-card p-4 shadow-sm sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
