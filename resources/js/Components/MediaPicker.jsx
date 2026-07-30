import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ImageOff, Loader2, Check } from "lucide-react";

/**
 * انتخابگر تصویر مشترک — با کلیک روی دکمه یک Dialog باز می‌شود
 * که هم آرشیو تصاویر قبلی را نشان می‌دهد، هم امکان آپلود جدید دارد.
 *
 * props:
 * - value: مسیر فعلی تصویر انتخاب‌شده (یا null)
 * - onSelect: تابعی که با مسیر جدید (path) صدا زده می‌شود
 */
export default function MediaPicker({ value, onSelect }) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchMedia();
        }
    }, [open]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch(route("admin.media-picker.list"));
            const data = await res.json();
            setItems(data);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

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
            <div className="flex items-center gap-3">
                {value ? (
                    <img
                        src={`/storage/${value}`}
                        alt=""
                        className="size-16 rounded-md border border-border object-cover"
                    />
                ) : (
                    <div className="flex size-16 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
                        <ImageOff className="size-5" />
                    </div>
                )}
                <div className="flex flex-col gap-1.5">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        {value ? "Change image" : "Choose image"}
                    </Button>
                    {value && (
                        <button
                            type="button"
                            onClick={() => onSelect(null)}
                            className="text-xs text-muted-foreground hover:text-destructive"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Select Image</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="library">
                        <TabsList>
                            <TabsTrigger value="library">
                                Media Library
                            </TabsTrigger>
                            <TabsTrigger value="upload">Upload New</TabsTrigger>
                        </TabsList>

                        <TabsContent value="library">
                            {loading ? (
                                <div className="flex h-48 items-center justify-center text-muted-foreground">
                                    <Loader2 className="size-5 animate-spin" />
                                </div>
                            ) : items.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    No images yet. Upload your first one.
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
                                                <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                />
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
