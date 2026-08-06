import { useEffect, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { at } from "@/lib/admin-i18n";

const statusColor = {
    new: "bg-status-reserved/15 text-status-reserved border-status-reserved/30",
    in_progress:
        "bg-status-pending/15 text-status-pending border-status-pending/30",
    closed: "bg-status-available/15 text-status-available border-status-available/30",
};

export default function Index({ contactRequests }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [selected, setSelected] = useState(null);

    const TYPE_LABELS = {
        contact: at("request_type_contact", uiLocale),
        callback_request: at("request_type_callback", uiLocale),
        quote_request: at("request_type_quote", uiLocale),
    };

    const STATUS_LABELS = {
        new: at("request_status_new", uiLocale),
        in_progress: at("request_status_in_progress", uiLocale),
        closed: at("request_status_closed", uiLocale),
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const { data, setData, put, processing } = useForm({
        status: "new",
        reply_message: "",
    });

    const openReply = (request) => {
        setSelected(request);
        setData({
            status: request.status,
            reply_message: request.reply_message ?? "",
        });
    };

    const submitReply = (e) => {
        e.preventDefault();
        put(route("admin.contact-requests.update", selected.id), {
            preserveScroll: true,
            onSuccess: () => setSelected(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("messages", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("contact_requests", uiLocale)}
                </h2>
            }
        >
            <Head title={at("contact_requests", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <p className="mb-6 text-sm text-muted-foreground">
                        {contactRequests.total}{" "}
                        {contactRequests.total === 1
                            ? at("request_singular", uiLocale)
                            : at("requests_count", uiLocale)}
                    </p>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {at("type_col", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("from_col", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("about_col", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("store", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("date_col", uiLocale)}
                                        </TableHead>
                                        <TableHead className="w-24"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contactRequests.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                {at(
                                                    "no_messages_yet",
                                                    uiLocale,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {contactRequests.data.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell className="align-middle">
                                                <Badge variant="outline">
                                                    {TYPE_LABELS[request.type]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <p className="font-medium text-foreground">
                                                    {request.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {request.email}
                                                </p>
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {request.product?.title?.en ??
                                                    "—"}
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {request.store?.name ?? "—"}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        statusColor[
                                                            request.status
                                                        ]
                                                    }
                                                >
                                                    {
                                                        STATUS_LABELS[
                                                            request.status
                                                        ]
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {new Date(
                                                    request.created_at,
                                                ).toLocaleDateString(
                                                    uiLocale === "fa"
                                                        ? "fa-IR"
                                                        : "en-US",
                                                )}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        openReply(request)
                                                    }
                                                >
                                                    {at("reply", uiLocale)}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {contactRequests.links.length > 3 && (
                        <div className="mt-6 flex flex-wrap gap-1">
                            {contactRequests.links.map((link, index) =>
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
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {at("message_from", uiLocale)} {selected?.name}
                        </DialogTitle>
                        <DialogDescription>{selected?.email}</DialogDescription>
                    </DialogHeader>

                    {selected && (
                        <div className="space-y-4">
                            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-foreground">
                                {selected.message || (
                                    <span className="text-muted-foreground">
                                        {at("no_message_provided", uiLocale)}
                                    </span>
                                )}
                            </div>

                            <form onSubmit={submitReply} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>{at("status", uiLocale)}</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData("status", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {(value) =>
                                                    STATUS_LABELS[value]
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">
                                                {at(
                                                    "request_status_new",
                                                    uiLocale,
                                                )}
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                {at(
                                                    "request_status_in_progress",
                                                    uiLocale,
                                                )}
                                            </SelectItem>
                                            <SelectItem value="closed">
                                                {at(
                                                    "request_status_closed",
                                                    uiLocale,
                                                )}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="reply_message">
                                        {at("reply", uiLocale)}
                                    </Label>
                                    <Textarea
                                        id="reply_message"
                                        rows={4}
                                        value={data.reply_message}
                                        onChange={(e) =>
                                            setData(
                                                "reply_message",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSelected(null)}
                                    >
                                        {at("cancel", uiLocale)}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? at("saving", uiLocale)
                                            : at("save", uiLocale)}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
