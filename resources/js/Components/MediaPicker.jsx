import { useEffect, useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ImageOff, Loader2, Check, Pencil, Trash2, Plus } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { usePage } from "@inertiajs/react";

/**
 * انتخابگر تصویر مشترک — با کلیک روی دکمه یک Dialog باز می‌شود
 * که هم آرشیو تصاویر قبلی را نشان می‌دهد، هم امکان آپلود جدید دارد.
 *
 * props:
 * - value: مسیر فعلی تصویر انتخاب‌شده (یا null)
 * - onSelect: تابعی که با مسیر جدید (path) صدا زده می‌شود
 */
export default function MediaPicker({ value, onSelect }) {
    const { locale } = usePage().props;
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [galleryReady, setGalleryReady] = useState(false);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(null);

    useEffect(() => {
        if (open) {
            fetchMedia();
        }
    }, [open]);

    const fetchMedia = async () => {
        setLoading(true);
        setGalleryReady(false);
        try {
            const res = await fetch(route("admin.media-picker.list"));
            const data = await res.json();
            setItems(data);

            // منتظر می‌مانیم همه‌ی تصاویر واقعاً در حافظه‌ی مرورگر لود شوند،
            // تا گالری یک‌جا و بدون پرش تدریجی نمایش داده شود
            await Promise.all(
                data.map(
                    (item) =>
                        new Promise((resolve) => {
                            const img = new Image();
                            img.src = `/storage/${item.path}`;
                            img.onload = resolve;
                            img.onerror = resolve;
                        }),
                ),
            );
            setGalleryReady(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(route("admin.media-picker.upload"), {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    )?.content,
                },
                body: formData,
            });

            if (res.ok) {
                const newMedia = await res.json();
                setItems((prev) => [newMedia, ...prev]);
                onSelect(newMedia.path);
                setOpen(false);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {value ? (
                <div className="group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                    <img
                        src={`/storage/${value}`}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            title={at("change_image", locale)}
                            className="flex size-8 items-center justify-center rounded-full bg-background text-foreground shadow-sm hover:text-primary"
                        >
                            <Pencil className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onSelect(null)}
                            title={at("remove", locale)}
                            className="flex size-8 items-center justify-center rounded-full bg-background text-destructive shadow-sm hover:bg-destructive/10"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    title={at("choose_image", locale)}
                    className="flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                    <Plus className="size-5" />
                    <span className="text-[11px]">{at("add", locale)}</span>
                </button>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{at("select_image", locale)}</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="library">
                        <TabsList>
                            <TabsTrigger value="library">
                                {at("media_library", locale)}
                            </TabsTrigger>
                            <TabsTrigger value="upload">
                                {at("upload_new", locale)}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="library">
                            {loading || !galleryReady ? (
                                <div className="flex h-48 items-center justify-center text-muted-foreground">
                                    <Loader2 className="size-5 animate-spin" />
                                </div>
                            ) : items.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    {at("no_images_yet", locale)}
                                </p>
                            ) : (
                                <div className="grid max-h-80 grid-cols-4 gap-3 overflow-y-auto py-2 sm:grid-cols-6">
                                    {items.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                onSelect(item.path);
                                                setOpen(false);
                                            }}
                                            className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                                                value === item.path
                                                    ? "border-primary"
                                                    : "border-transparent hover:border-border"
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${item.path}`}
                                                alt={item.filename}
                                                className="h-full w-full object-cover"
                                            />
                                            {value === item.path && (
                                                <span className="absolute top-1 end-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                    <Check className="size-3" />
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="upload">
                            <div className="py-6">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={uploading}
                                    className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                                >
                                    <span className="truncate text-muted-foreground">
                                        {fileName ??
                                            at("no_file_chosen", locale)}
                                    </span>
                                    <span className="shrink-0 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                        {at("choose_file", locale)}
                                    </span>
                                </button>
                                {uploading && (
                                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Uploading...
                                    </p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
}
