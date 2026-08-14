import { useState } from "react";
import * as jalaali from "jalaali-js";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toFa } from "@/lib/toFa";

const PERSIAN_MONTHS = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
];
const PERSIAN_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const GREGORIAN_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const GREGORIAN_WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad2(n) {
    return String(n).padStart(2, "0");
}

/**
 * تاریخ ورودی/خروجی همیشه ISO میلادی (YYYY-MM-DD) است — همان چیزی که
 * بک‌اند (whereDate) انتظار دارد. فقط نمایش/انتخاب برای locale فارسی
 * روی تقویم شمسی (با jalaali-js، دقیق تا سطح روز) انجام می‌شود.
 */
export default function DatePicker({ value, onChange, locale, placeholder }) {
    const isFa = locale === "fa";
    const [open, setOpen] = useState(false);

    const selectedGregorian = value ? parseIso(value) : null;

    const initialView = selectedGregorian ?? new Date();
    const [viewYear, setViewYear] = useState(() =>
        isFa
            ? jalaali.toJalaali(
                  initialView.getFullYear(),
                  initialView.getMonth() + 1,
                  initialView.getDate(),
              ).jy
            : initialView.getFullYear(),
    );
    const [viewMonth, setViewMonth] = useState(() =>
        isFa
            ? jalaali.toJalaali(
                  initialView.getFullYear(),
                  initialView.getMonth() + 1,
                  initialView.getDate(),
              ).jm
            : initialView.getMonth() + 1,
    );

    const goToAdjacentMonth = (delta) => {
        let y = viewYear;
        let m = viewMonth + delta;
        if (m < 1) {
            m = 12;
            y -= 1;
        } else if (m > 12) {
            m = 1;
            y += 1;
        }
        setViewYear(y);
        setViewMonth(m);
    };

    const selectDay = (isoDate) => {
        onChange(isoDate);
        setOpen(false);
    };

    const days = isFa
        ? buildJalaliMonthGrid(viewYear, viewMonth)
        : buildGregorianMonthGrid(viewYear, viewMonth);

    const monthLabel = isFa
        ? `${PERSIAN_MONTHS[viewMonth - 1]} ${toFa(viewYear, "fa")}`
        : `${GREGORIAN_MONTHS[viewMonth - 1]} ${viewYear}`;

    const weekdayLabels = isFa ? PERSIAN_WEEKDAYS : GREGORIAN_WEEKDAYS;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        className="w-40 justify-start rounded-lg shadow-sm"
                    >
                        <Calendar className="me-1.5 size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                            {value
                                ? formatDisplay(value, isFa)
                                : placeholder}
                        </span>
                    </Button>
                }
            />
            <PopoverContent
                className="w-72 rounded-xl shadow-2xl"
                dir={isFa ? "rtl" : "ltr"}
            >
                <div className="mb-3 flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => goToAdjacentMonth(isFa ? 1 : -1)}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm font-medium text-foreground">
                        {monthLabel}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => goToAdjacentMonth(isFa ? -1 : 1)}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                    {weekdayLabels.map((label) => (
                        <span
                            key={label}
                            className="text-xs font-medium text-muted-foreground"
                        >
                            {label}
                        </span>
                    ))}

                    {days.map((day, index) =>
                        day ? (
                            <button
                                key={day.iso}
                                type="button"
                                onClick={() => selectDay(day.iso)}
                                className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors hover:bg-muted ${
                                    day.iso === value
                                        ? "bg-primary text-primary-foreground hover:bg-primary"
                                        : "text-foreground"
                                }`}
                            >
                                {isFa ? toFa(day.label, "fa") : day.label}
                            </button>
                        ) : (
                            <span key={`empty-${index}`} />
                        ),
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function parseIso(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function formatDisplay(iso, isFa) {
    const [y, m, d] = iso.split("-").map(Number);
    if (!isFa) return iso;
    const { jy, jm, jd } = jalaali.toJalaali(y, m, d);
    return `${toFa(jd, "fa")} ${PERSIAN_MONTHS[jm - 1]} ${toFa(jy, "fa")}`;
}

function buildGregorianMonthGrid(year, month) {
    const firstOfMonth = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const leadingBlanks = firstOfMonth.getDay(); // 0=Sunday

    const cells = Array.from({ length: leadingBlanks }, () => null);
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({
            label: d,
            iso: `${year}-${pad2(month)}-${pad2(d)}`,
        });
    }
    return cells;
}

function buildJalaliMonthGrid(jy, jm) {
    const daysInMonth = jalaali.jalaaliMonthLength(jy, jm);
    const firstGregorian = jalaali.toGregorian(jy, jm, 1);
    const firstDate = new Date(
        firstGregorian.gy,
        firstGregorian.gm - 1,
        firstGregorian.gd,
    );
    // هفته‌ی شمسی از شنبه شروع می‌شود؛ getDay() یکشنبه=۰ است، پس با
    // جابه‌جایی یک روزه به شنبه=۰ تبدیل می‌کنیم.
    const leadingBlanks = (firstDate.getDay() + 1) % 7;

    const cells = Array.from({ length: leadingBlanks }, () => null);
    for (let d = 1; d <= daysInMonth; d++) {
        const { gy, gm, gd } = jalaali.toGregorian(jy, jm, d);
        cells.push({
            label: d,
            iso: `${gy}-${pad2(gm)}-${pad2(gd)}`,
        });
    }
    return cells;
}
