import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { tt } from "@/lib/i18n";

export default function ForgotPassword({ status }) {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title={tt("forgot_password_title", locale)} />

            <div className="mb-4 text-sm text-muted-foreground">
                {tt("forgot_password_desc", locale)}
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-status-available">
                    {status}
                </div>
            )}

            <form onSubmit={submit} noValidate>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end rtl:justify-start">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {tt("email_password_reset_link", locale)}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
