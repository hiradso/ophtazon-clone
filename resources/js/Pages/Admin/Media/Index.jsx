import { useEffect, useState, useRef } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Trash2, Loader2, Copy, Pencil, Check, X } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { toFa } from "@/lib/toFa";

export default function Index({ media }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [fileInputKey, setFileInputKey] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        files: [],
    });

    useEffect(() => {
        if (flash?.success) toast.success(at(flash.success, uiLocale));
        if (flash?.error) toast.error(at(flash.error, uiLocale));
    }, [flash]);

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setData("files", files);
    };

    const submitUpload = (e) => {
        e.preventDefault();
        setUploadProgress(0);

        post(route("admin.media.store"), {
            forceFormData: true,
            onProgress: (progress) => {
                setUploadProgress(progress?.percentage ?? 0);
            },
            onSuccess: () => {
                reset("files");
                setFileInputKey((prev) => prev + 1);
                setUploadProgress(null);
            },
            onError: () => {
                setUploadProgress(null);
            },
        });
    };

    const confirmDelete = () => {
        router.delete(route("admin.media.destroy", itemToDelete.id), {
            onSuccess: () => setItemToDelete(null),
        });
    };

    const copyUrl = (path) => {
        const url = `${window.location.origin}/storage/${path}`;
        navigator.clipboard.writeText(url);
        toast.success(at("url_copied", uiLocale));
    };

    const startEditing = (item) => {
        setEditingId(item.id);
        setEditingName(item.filename);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName("");
    };

    const saveEditing = (itemId) => {
        if (!editingName.trim()) return;

        router.put(
            route("admin.media.update", itemId),
            { filename: editingName },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingId(null);
                    setEditingName("");
                },
            },
        );
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("media_library", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("media_library", uiLocale)}
                </h2>
            }
        >
            <Head title={at("media_library", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <Card className="mb-6">
                        <CardContent className="space-y-3 p-4">
                            <form
                                onSubmit={submitUpload}
                                className="flex flex-wrap items-center gap-3"
                            >
                                <input
                                    key={fileInputKey}
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFilesChange}
                                    disabled={processing}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={processing}
                                    className="flex max-w-sm flex-1 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                                >
                                    <span className="truncate text-muted-foreground">
                                        {data.files.length > 0
                                            ? `${data.files.length} ${at("files_selected", uiLocale)}`
                                            : at("no_file_chosen", uiLocale)}
                                    </span>
                                    <span className="shrink-0 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                        {at("choose_file", uiLocale)}
                                    </span>
                                </button>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing || data.files.length === 0
                                    }
                                >
                                    {processing ? (
                                        <Loader2 className="me-1.5 size-4 animate-spin" />
                                    ) : (
                                        <Upload className="me-1.5 size-4" />
                                    )}
                                    {processing
                                        ? at("uploading", uiLocale)
                                        : at("upload_new", uiLocale)}
                                </Button>
                            </form>

                            {uploadProgress !== null && (
                                <div className="max-w-sm">
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-200 ease-out"
                                            style={{
                                                width: `${uploadProgress}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {uploadProgress}%{" "}
                                        {at("uploaded_suffix", uiLocale)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <p className="mb-4 text-sm text-muted-foreground">
                        {toFa(media.total, uiLocale)}{" "}
                        {media.total === 1
                            ? at("file_singular", uiLocale)
                            : at("files_count", uiLocale)}
                    </p>

                    {media.data.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                            {at("no_media_yet", uiLocale)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                            {media.data.map((item) => (
                                <Card
                                    key={item.id}
                                    className="group overflow-hidden py-0"
                                >
                                    <div className="relative h-40">
                                        <img
                                            src={`/storage/${item.path}`}
                                            alt={item.filename}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={() =>
                                                    copyUrl(item.path)
                                                }
                                            >
                                                <Copy className="size-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={() =>
                                                    startEditing(item)
                                                }
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    setItemToDelete(item)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-2">
                                        {editingId === item.id ? (
                                            <div className="flex items-center gap-1">
                                                <Input
                                                    value={editingName}
                                                    onChange={(e) =>
                                                        setEditingName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter")
                                                            saveEditing(
                                                                item.id,
                                                            );
                                                        if (e.key === "Escape")
                                                            cancelEditing();
                                                    }}
                                                    className="h-7 px-1.5 text-xs"
                                                    autoFocus
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        saveEditing(item.id)
                                                    }
                                                    className="shrink-0 text-status-available"
                                                >
                                                    <Check className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={cancelEditing}
                                                    className="shrink-0 text-muted-foreground"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <p
                                                className="cursor-pointer truncate text-xs text-muted-foreground hover:text-foreground"
                                                title={item.filename}
                                                onClick={() =>
                                                    startEditing(item)
                                                }
                                            >
                                                {item.filename}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {media.links.length > 3 && (
                        <div className="mt-6 flex flex-wrap gap-1">
                            {media.links.map((link, index) =>
                                link.url ? (
                                    <Button
                                        key={index}
                                        nativeButton={false}
                                        render={<Link href={link.url} />}
                                        variant={
                                            link.active ? "default" : "ghost"
                                        }
                                        size="sm"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        size="sm"
                                        disabled
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                open={!!itemToDelete}
                onOpenChange={(open) => !open && setItemToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {at("delete_file_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {itemToDelete && `"${itemToDelete.filename}"`}{" "}
                            {at("delete_file_confirm_desc", uiLocale)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setItemToDelete(null)}
                        >
                            {at("cancel", uiLocale)}
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            {at("delete", uiLocale)}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
