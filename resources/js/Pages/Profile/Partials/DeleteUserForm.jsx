import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import { tt } from "@/lib/i18n";
import { Trash2 } from "lucide-react";

export default function DeleteUserForm({ className = "" }) {
    const { locale: uiLocale } = usePage().props;
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="flex items-center gap-2 text-lg font-medium text-destructive">
                    <Trash2 className="size-4.5" />
                    {tt("delete_account", uiLocale)}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    {tt("delete_account_desc", uiLocale)}
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                {tt("delete_account", uiLocale)}
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-foreground">
                        {tt("confirm_delete_account_title", uiLocale)}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {tt("confirm_delete_account_desc", uiLocale)}
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value={tt("password", uiLocale)}
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder={tt("password", uiLocale)}
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {tt("cancel", uiLocale)}
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            {tt("delete_account", uiLocale)}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
