import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Undo,
    Redo,
    Palette,
    Ban,
} from "lucide-react";

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
 */
export default function RichTextEditor({ value, onChange }) {
    const [recentColors, setRecentColors] = useState([]);

    useEffect(() => {
        setRecentColors(getRecentColors());
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
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
                class: "prose prose-neutral dark:prose-invert max-w-none min-h-48 px-3 py-2 focus:outline-none",
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

    return (
        <div className="rounded-md border border-input bg-background">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
                <ToolbarButton
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={Bold}
                />
                <ToolbarButton
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={Italic}
                />
                <ToolbarButton
                    active={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    icon={Strikethrough}
                />

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    icon={Heading2}
                />
                <ToolbarButton
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    icon={Heading3}
                />

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    active={editor.isActive("bulletList")}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    icon={List}
                />
                <ToolbarButton
                    active={editor.isActive("orderedList")}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    icon={ListOrdered}
                />
                <ToolbarButton
                    active={editor.isActive("blockquote")}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    icon={Quote}
                />
                <ToolbarButton
                    active={editor.isActive("link")}
                    onClick={addLink}
                    icon={LinkIcon}
                />

                <Separator orientation="vertical" className="mx-1 h-5" />

                {/* انتخابگر رنگ متن — پالت سفارشی + رنگ‌های اخیراً استفاده‌شده */}
                <div className="flex items-center gap-1.5 rounded-md px-1">
                    <Palette className="size-3.5 text-muted-foreground" />

                    <button
                        type="button"
                        title="Remove color"
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
                        title="Pick a custom color"
                        className="size-5 cursor-pointer rounded-full border border-border bg-transparent p-0"
                    />
                </div>

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    icon={Undo}
                    disabled={!editor.can().undo()}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    icon={Redo}
                    disabled={!editor.can().redo()}
                />
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}

function ToolbarButton({ icon: Icon, active, onClick, disabled }) {
    return (
        <Button
            type="button"
            variant={active ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={onClick}
            disabled={disabled}
        >
            <Icon className="size-4" />
        </Button>
    );
}
