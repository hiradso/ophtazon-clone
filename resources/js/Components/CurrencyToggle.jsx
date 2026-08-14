import { Coins } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/lib/currency-provider";
import { tt } from "@/lib/i18n";

export default function CurrencyToggle() {
    const { currency, setCurrency, availableCurrencies } = useCurrency();
    const { locale } = usePage().props;

    if (availableCurrencies.length < 2) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" size="icon">
                        <Coins className="size-4" />
                        <span className="sr-only">
                            {tt("toggle_currency", locale)}
                        </span>
                    </Button>
                }
            />
            <DropdownMenuContent align="end">
                {availableCurrencies.map((code) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => setCurrency(code)}
                    >
                        {code}
                        {currency === code && (
                            <span className="ml-auto text-xs text-muted-foreground">
                                ✓
                            </span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
