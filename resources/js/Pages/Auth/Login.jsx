import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import PasswordInput from "@/Components/PasswordInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { tt } from "@/lib/i18n";

export default function Login({ status, canResetPassword }) {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title={tt("log_in", locale)} />

            {status && (
                <div className="mb-4 text-sm font-medium text-status-available">
                    {status}
                </div>
            )}

            <form onSubmit={submit} noValidate>
                <div>
                    <InputLabel htmlFor="email" value={tt("email", locale)} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value={tt("password", locale)} />

                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-muted-foreground">
                            {tt("remember_me", locale)}
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end rtl:justify-start">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-muted-foreground underline hover:text-foreground focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            {tt("forgot_your_password", locale)}
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        {tt("log_in", locale)}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
