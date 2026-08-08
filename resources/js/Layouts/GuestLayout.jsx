import { Link, usePage } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    const { siteSettings } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col items-center bg-muted/30 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    {siteSettings?.logo ? (
                        <img
                            src={`/storage/${siteSettings.logo}`}
                            alt={siteSettings.site_name}
                            className="h-20 w-20 object-contain"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-2xl font-bold">
                                {siteSettings?.site_name?.charAt(0) ?? "O"}
                            </span>
                        </div>
                    )}
                </Link>
            </div>
            <div className="mt-6 w-full overflow-hidden bg-card px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
