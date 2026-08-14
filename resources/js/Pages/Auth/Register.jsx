import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import PasswordInput from "@/Components/PasswordInput";
import PasswordStrengthMeter from "@/Components/PasswordStrengthMeter";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { tt } from "@/lib/i18n";
import { getPasswordStrength } from "@/lib/passwordStrength";

export default function Register() {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const passwordLabels = {
        weak: tt("password_strength_weak", locale),
        medium: tt("password_strength_medium", locale),
        strong: tt("password_strength_strong", locale),
        length: tt("password_criteria_length", locale),
        lower: tt("password_criteria_lower", locale),
        upper: tt("password_criteria_upper", locale),
        number: tt("password_criteria_number", locale),
        special: tt("password_criteria_special", locale),
    };
    const isPasswordWeak =
        getPasswordStrength(data.password).strength === "weak";

    return (
        <GuestLayout>
            <Head title={tt("register", locale)} />

            <form onSubmit={submit} noValidate>
                <div>
                    <InputLabel htmlFor="name" value={tt("name_field", locale)} />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value={tt("email", locale)} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />

                    <div className="mt-2">
                        <PasswordStrengthMeter
                            password={data.password}
                            labels={passwordLabels}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={tt("confirm_password", locale)}
                    />

                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end rtl:justify-start">
                    <Link
                        href={route("login")}
                        className="rounded-md text-sm text-muted-foreground underline hover:text-foreground focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                        {tt("already_registered", locale)}
                    </Link>

                    <PrimaryButton
                        className="ms-4"
                        disabled={processing || isPasswordWeak}
                    >
                        {tt("register", locale)}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
