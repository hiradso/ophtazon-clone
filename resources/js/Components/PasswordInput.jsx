import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import TextInput from "@/Components/TextInput";

export default forwardRef(function PasswordInput(
    { className = "", ...props },
    ref,
) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={"relative " + className}>
            <TextInput
                {...props}
                ref={ref}
                type={visible ? "text" : "password"}
                className="w-full pe-10"
            />
            <button
                type="button"
                tabIndex={-1}
                onClick={() => setVisible((v) => !v)}
                className="absolute inset-y-0 end-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
            >
                {visible ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </button>
        </div>
    );
});
