import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { at } from "@/lib/admin-i18n";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const { locale: uiLocale } = usePage().props;
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-foreground">
                    {at("profile_information", uiLocale)}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    {at("profile_information_desc", uiLocale)}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value={at("name_field", uiLocale)}
                    />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value={at("email_field", uiLocale)}
                    />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-foreground">
                            {at("email_unverified", uiLocale)}
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-muted-foreground underline hover:text-foreground focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                                {at("resend_verification", uiLocale)}
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-status-available">
                                {at("verification_link_sent", uiLocale)}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {at("save", uiLocale)}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-muted-foreground">
                            {at("saved_label", uiLocale)}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
