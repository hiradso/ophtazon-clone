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

const TYPE_LABELS = {
    contact: "General",
    callback_request: "Callback",
    quote_request: "Quote",
};

const STATUS_LABELS = {
    new: "New",
    in_progress: "In Progress",
    closed: "Closed",
};

const statusColor = {
    new: "bg-status-reserved/15 text-status-reserved border-status-reserved/30",
    in_progress:
        "bg-status-pending/15 text-status-pending border-status-pending/30",
    closed: "bg-status-available/15 text-status-available border-status-available/30",
};

export default function Index({ contactRequests }) {
    const { flash } = usePage().props;
    const [selected, setSelected] = useState(null);

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
                { label: "Dashboard", href: route("dashboard") },
                { label: "Messages" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Contact Requests
                </h2>
            }
        >
            <Head title="Contact Requests" />

            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <p className="mb-6 text-sm text-muted-foreground">
                        {contactRequests.total}{" "}
                        {contactRequests.total === 1 ? "request" : "requests"}
                    </p>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>From</TableHead>
                                        <TableHead>About</TableHead>
                                        <TableHead>Store</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
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
                                                No messages yet.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {contactRequests.data.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {TYPE_LABELS[request.type]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-foreground">
                                                    {request.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {request.email}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {request.product?.title?.en ??
                                                    "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {request.store?.name ?? "—"}
                                            </TableCell>
                                            <TableCell>
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
                                            <TableCell className="text-muted-foreground">
                                                {new Date(
                                                    request.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        openReply(request)
                                                    }
                                                >
                                                    Reply
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
                        <DialogTitle>Message from {selected?.name}</DialogTitle>
                        <DialogDescription>{selected?.email}</DialogDescription>
                    </DialogHeader>

                    {selected && (
                        <div className="space-y-4">
                            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-foreground">
                                {selected.message || (
                                    <span className="text-muted-foreground">
                                        No message provided.
                                    </span>
                                )}
                            </div>

                            <form onSubmit={submitReply} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Status</Label>
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
                                                New
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="closed">
                                                Closed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="reply_message">Reply</Label>
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
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? "Saving..." : "Save"}
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
