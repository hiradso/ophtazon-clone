import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { tt } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Edit({ mustVerifyEmail, status }) {
    const { auth, locale: uiLocale } = usePage().props;
    const isStaffOrAdmin =
        auth.user.role === "admin" || auth.user.role === "staff";

    return (
        <PublicLayout>
            <Head title={tt("profile", uiLocale)} />
            <div className="py-12">
                <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                            {tt("profile", uiLocale)}
                        </h2>

                        {isStaffOrAdmin && (
                            <Button
                                variant="outline"
                                size="sm"
                                nativeButton={false}
                                render={<Link href={route("dashboard")} />}
                            >
                                <LayoutDashboard className="me-1.5 size-4" />
                                {tt("dashboard", uiLocale)}
                            </Button>
                        )}
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
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
