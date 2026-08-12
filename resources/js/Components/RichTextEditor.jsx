import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "@tiptap/extension-text-style/font-size";
import Color from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    Pilcrow,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Undo,
    Redo,
    Palette,
    Ban,
} from "lucide-react";
import { at } from "@/lib/admin-i18n";

const HEADING_ICONS = { 1: Heading1, 2: Heading2, 3: Heading3 };

const DEFAULT_FONT_SIZE = "default";
const FONT_SIZES = [
    { value: DEFAULT_FONT_SIZE, label: "Default" },
    { value: "0.875rem", label: "Small" },
    { value: "1rem", label: "Normal" },
    { value: "1.25rem", label: "Large" },
    { value: "1.5rem", label: "X-Large" },
    { value: "2rem", label: "XX-Large" },
];

const RECENT_COLORS_KEY = "wysiwyg-recent-colors";
const MAX_RECENT_COLORS = 8;

function getRecentColors() {
    try {
        const stored = localStorage.getItem(RECENT_COLORS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveRecentColor(color) {
    const current = getRecentColors().filter((c) => c !== color);
    const updated = [color, ...current].slice(0, MAX_RECENT_COLORS);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
    return updated;
}

/**
 * ویرایشگر گرافیکی مشترک — خروجی یک رشته‌ی HTML تمیز است
 * که مستقیم می‌تواند در دیتابیس ذخیره و بعداً با dangerouslySetInnerHTML نمایش داده شود.
 *
 * props:
 * - value: محتوای فعلی (رشته‌ی HTML)
 * - onChange: تابعی که با HTML جدید صدا زده می‌شود
 * - headingLevels: کدوم سطح‌های تیتر (۱ تا ۳) در نوار ابزار نشون داده بشه.
 *   پیش‌فرض [2, 3] — یعنی H1 اینجا نیست، چون این ویرایشگر معمولاً برای
 *   محتوای بدنه (نه تیتر اصلی صفحه) استفاده می‌شه و هر صفحه فقط باید
 *   یک H1 داشته باشه (برای سئو). فقط برای فیلدهایی که واقعاً معادل تیتر
 *   اصلی صفحه‌ان (مثل عنوان Hero) باید [1, 2, 3] پاس داده بشه.
 * - compact: ارتفاع کمتر برای فیلدهای کوتاه یک‌خطی (تیتر، زیرتیتر)
 */
export default function RichTextEditor({
    value,
    onChange,
    headingLevels = [2, 3],
    compact = false,
}) {
    const { locale: uiLocale } = usePage().props;
    const [recentColors, setRecentColors] = useState([]);

    useEffect(() => {
        setRecentColors(getRecentColors());
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            FontSize,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline",
                },
            }),
        ],
        content: value || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose prose-neutral dark:prose-invert max-w-none px-3 py-2 focus:outline-none ${compact ? "min-h-12" : "min-h-48"}`,
            },
        },
    });

    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt("Enter URL");
        if (!url) return;
        editor.chain().focus().setLink({ href: url }).run();
    };

    const applyColor = (color) => {
        editor.chain().focus().setColor(color).run();
    };

    const clearColor = () => {
        editor.chain().focus().unsetColor().run();
    };

    const pickCustomColor = (color) => {
        applyColor(color);
        setRecentColors(saveRecentColor(color));
    };

    const applyFontSize = (size) => {
        if (size && size !== DEFAULT_FONT_SIZE) {
            editor.chain().focus().setFontSize(size).run();
        } else {
            editor.chain().focus().unsetFontSize().run();
        }
    };

    const currentFontSize =
        editor.getAttributes("textStyle").fontSize || DEFAULT_FONT_SIZE;

    return (
        <div className="rounded-md border border-input bg-background">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
                <ToolbarButton
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={Bold}
                    title={at("editor_bold", uiLocale)}
                />
                <ToolbarButton
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    label="S"
                    title={at("editor_strong", uiLocale)}
                />
                <ToolbarButton
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={Italic}
                    title={at("editor_italic", uiLocale)}
                />
                <ToolbarButton
                    active={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    icon={Strikethrough}
                    title={at("editor_strike", uiLocale)}
                />

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    active={editor.isActive("paragraph")}
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    icon={Pilcrow}
                    title={at("editor_paragraph", uiLocale)}
                />
                {headingLevels.map((level) => (
                    <ToolbarButton
                        key={level}
                        active={editor.isActive("heading", { level })}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level })
                                .run()
                        }
                        icon={HEADING_ICONS[level]}
                        title={`${at("editor_heading", uiLocale)} ${level}`}
                    />
                ))}

                <Separator orientation="vertical" className="mx-1 h-5" />

                <Select value={currentFontSize} onValueChange={applyFontSize}>
                    <SelectTrigger
                        size="sm"
                        className="h-7 w-28 text-xs"
                        title={at("editor_font_size", uiLocale)}
                    >
                        <SelectValue>
                            {(value) =>
                                FONT_SIZES.find((s) => s.value === value)
                                    ?.label ?? "Default"
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {FONT_SIZES.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                                {size.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    active={editor.isActive("bulletList")}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    icon={List}
                    title={at("editor_bullet_list", uiLocale)}
                />
                <ToolbarButton
                    active={editor.isActive("orderedList")}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    icon={ListOrdered}
                    title={at("editor_ordered_list", uiLocale)}
                />
                <ToolbarButton
                    active={editor.isActive("blockquote")}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    icon={Quote}
                    title={at("editor_blockquote", uiLocale)}
                />
                <ToolbarButton
                    active={editor.isActive("link")}
                    onClick={addLink}
                    icon={LinkIcon}
                    title={at("editor_link", uiLocale)}
                />

                <Separator orientation="vertical" className="mx-1 h-5" />

                {/* انتخابگر رنگ متن — پالت سفارشی + رنگ‌های اخیراً استفاده‌شده */}
                <div className="flex items-center gap-1.5 rounded-md px-1">
                    <Palette className="size-3.5 text-muted-foreground" />

                    <button
                        type="button"
                        title={at("editor_remove_color", uiLocale)}
                        onClick={clearColor}
                        className="flex size-5 items-center justify-center rounded-full border border-border text-destructive hover:bg-destructive/10"
                    >
                        <Ban className="size-3" />
                    </button>

                    {recentColors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            title={color}
                            onClick={() => applyColor(color)}
                            className={`size-5 rounded-full border transition-transform hover:scale-110 ${
                                editor.isActive("textStyle", { color })
                                    ? "ring-2 ring-ring ring-offset-1"
                                    : "border-border"
                            }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}

                    <input
                        type="color"
                        onInput={(e) => applyColor(e.target.value)}
                        onBlur={(e) =>
                            setRecentColors(saveRecentColor(e.target.value))
                        }
                        title={at("editor_pick_color", uiLocale)}
                        className="size-5 cursor-pointer rounded-full border border-border bg-transparent p-0"
                    />
                </div>

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    icon={Undo}
                    disabled={!editor.can().undo()}
                    title={at("editor_undo", uiLocale)}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    icon={Redo}
                    disabled={!editor.can().redo()}
                    title={at("editor_redo", uiLocale)}
                />
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}

function ToolbarButton({
    icon: Icon,
    label,
    active,
    onClick,
    disabled,
    title,
}) {
    return (
        <Button
            type="button"
            variant={active ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {Icon ? (
                <Icon className="size-4" />
            ) : (
                <span className="text-sm font-bold">{label}</span>
            )}
        </Button>
    );
}
