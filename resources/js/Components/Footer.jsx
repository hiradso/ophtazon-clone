import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Phone } from "lucide-react";

export default function Footer() {
    const { footerLinkGroups, siteSettings } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        source: "footer",
    });

    const subscribe = (e) => {
        e.preventDefault();
        post(route("newsletter.store"), {
            preserveScroll: true,
            onSuccess: () => reset("email"),
        });
    };

    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* برند */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            {siteSettings.logo ? (
                                <img
                                    src={`/storage/${siteSettings.logo}`}
                                    alt={siteSettings.site_name}
                                    className="size-8 rounded-lg object-contain"
                                />
                            ) : (
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <span className="text-sm font-bold">
                                        {siteSettings.site_name?.charAt(0) ??
                                            "O"}
                                    </span>
                                </div>
                            )}
                            <span className="text-lg font-semibold text-foreground">
                                {siteSettings.site_name}
                            </span>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">
                            New and used ophthalmic equipment, checked and
                            shipped worldwide.
                        </p>

                        {(siteSettings.contact_email ||
                            siteSettings.contact_phone) && (
                            <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {siteSettings.contact_email && (
                                    <li className="flex items-center gap-1.5">
                                        <Mail className="size-3.5" />
                                        <a
                                            href={`mailto:${siteSettings.contact_email}`}
                                            className="hover:text-foreground"
                                        >
                                            {siteSettings.contact_email}
                                        </a>
                                    </li>
                                )}
                                {siteSettings.contact_phone && (
                                    <li className="flex items-center gap-1.5">
                                        <Phone className="size-3.5" />
                                        <a
                                            href={`tel:${siteSettings.contact_phone}`}
                                            className="hover:text-foreground"
                                        >
                                            {siteSettings.contact_phone}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* گروه‌های لینک پویا (مدیریت‌شده از پنل ادمین) */}
                    {Object.entries(footerLinkGroups).map(
                        ([groupLabel, links]) => (
                            <div key={groupLabel}>
                                <h3 className="mb-3 text-sm font-semibold text-foreground">
                                    {groupLabel}
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.url}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ),
                    )}

                    {/* خبرنامه */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Stay updated
                        </h3>
                        <p className="mb-3 text-sm text-muted-foreground">
                            New listings and offers, straight to your inbox.
                        </p>
                        <form onSubmit={subscribe} className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-w-28 gap-1.5"
                            >
                                {processing && (
                                    <Loader2 className="size-4 animate-spin" />
                                )}
                                {processing ? "Sending..." : "Join"}
                            </Button>
                        </form>
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} {siteSettings.site_name}.
                    All rights reserved.
                </div>
            </div>
        </footer>
    );
}
