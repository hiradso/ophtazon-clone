import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AdminLayout
            breadcrumbs={[{ label: "Dashboard" }]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                        <div className="p-6 text-foreground">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
