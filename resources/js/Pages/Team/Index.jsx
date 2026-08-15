import { Head, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { User } from "lucide-react";
import { t } from "@/lib/translate";
import { tt } from "@/lib/i18n";

export default function Index({ teamMembers }) {
    const { locale } = usePage().props;

    return (
        <PublicLayout>
            <Head title={tt("our_team", locale)} />

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
                    {tt("our_team", locale)}
                </h1>
                <p className="mb-10 text-sm text-muted-foreground">
                    {tt("our_team_intro", locale)}
                </p>

                {teamMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        {tt("our_team_empty", locale)}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="text-center">
                                <div className="mx-auto mb-4 flex size-28 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                                    {member.photo ? (
                                        <img
                                            src={`/storage/${member.photo}`}
                                            alt={t(member.name, locale)}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="size-10 text-muted-foreground" />
                                    )}
                                </div>
                                <h2 className="text-base font-semibold text-foreground">
                                    {t(member.name, locale)}
                                </h2>
                                {t(member.role_title, locale) && (
                                    <p className="text-sm text-muted-foreground">
                                        {t(member.role_title, locale)}
                                    </p>
                                )}
                                {t(member.bio, locale) && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {t(member.bio, locale)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
