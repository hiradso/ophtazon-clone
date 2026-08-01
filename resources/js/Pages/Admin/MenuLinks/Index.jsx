import { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function Index({ menuLinks }) {
    const { flash } = usePage().props;
    const [linkToDelete, setLinkToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.menu-links.destroy", linkToDelete.id), {
            onSuccess: () => setLinkToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Menu Links" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Menu Links
                </h2>
            }
        >
            <Head title="Menu Links" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {menuLinks.length}{" "}
                            {menuLinks.length === 1 ? "link" : "links"}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.menu-links.create")} />
                            }
                        >
                            <Plus className="mr-1.5 size-4" />
                            Add link
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Group</TableHead>
                                        <TableHead>Label</TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {menuLinks.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                No menu links yet. Add the first
                                                one to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {menuLinks.map((link) => (
                                        <TableRow key={link.id}>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {link.location}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {link.group_label?.en ?? "—"}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                {link.label?.en}
                                            </TableCell>
                                            <TableCell className="max-w-48 truncate text-muted-foreground">
                                                {link.url}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        link.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {link.is_active
                                                        ? "Active"
                                                        : "Hidden"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        render={
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        }
                                                    />
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            render={
                                                                <Link
                                                                    href={route(
                                                                        "admin.menu-links.edit",
                                                                        link.id,
                                                                    )}
                                                                />
                                                            }
                                                        >
                                                            <Pencil className="mr-2 size-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setLinkToDelete(
                                                                    link,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 size-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog
                open={!!linkToDelete}
                onOpenChange={(open) => !open && setLinkToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this link?</DialogTitle>
                        <DialogDescription>
                            {linkToDelete && (
                                <>
                                    "{linkToDelete.label?.en}" will be
                                    permanently deleted.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setLinkToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
