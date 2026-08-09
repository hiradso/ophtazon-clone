import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { at } from "@/lib/admin-i18n";

export default function Edit({ mustVerifyEmail, status }) {
    const { locale: uiLocale } = usePage().props;

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("profile", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("profile", uiLocale)}
                </h2>
            }
        >
            <Head title={at("profile", uiLocale)} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
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
        </AdminLayout>
    );
}
