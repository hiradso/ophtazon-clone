import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import PasswordStrengthMeter from '@/Components/PasswordStrengthMeter';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { tt } from '@/lib/i18n';
import { getPasswordStrength } from '@/lib/passwordStrength';

export default function ResetPassword({ token, email }) {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const passwordLabels = {
        weak: tt('password_strength_weak', locale),
        medium: tt('password_strength_medium', locale),
        strong: tt('password_strength_strong', locale),
        length: tt('password_criteria_length', locale),
        lower: tt('password_criteria_lower', locale),
        upper: tt('password_criteria_upper', locale),
        number: tt('password_criteria_number', locale),
        special: tt('password_criteria_special', locale),
    };
    const isPasswordWeak =
        getPasswordStrength(data.password).strength === 'weak';

    return (
        <GuestLayout>
            <Head title={tt('reset_password_title', locale)} />

            <form onSubmit={submit} noValidate>
                <div>
                    <InputLabel htmlFor="email" value={tt('email', locale)} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value={tt('password', locale)} />

                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
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
                        value={tt('confirm_password', locale)}
                    />

                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end rtl:justify-start">
                    <PrimaryButton
                        className="ms-4"
                        disabled={processing || isPasswordWeak}
                    >
                        {tt('reset_password_title', locale)}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
