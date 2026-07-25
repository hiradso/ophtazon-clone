import { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
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
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ stores }) {
    const { flash } = usePage().props;
    const [storeToDelete, setStoreToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.stores.destroy", storeToDelete.id), {
            onSuccess: () => setStoreToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Stores" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Stores
                </h2>
            }
        >
            <Head title="Stores" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {stores.length}{" "}
                            {stores.length === 1 ? "store" : "stores"}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.stores.create")} />
                            }
                        >
                            <Plus className="mr-1.5 size-4" />
                            Add store
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stores.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                No stores yet. Add the first one
                                                to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {stores.map((store) => (
                                        <TableRow key={store.id}>
                                            <TableCell className="font-medium">
                                                {store.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {store.country?.name ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {store.email ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {store.products_count}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        store.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {store.is_active
                                                        ? "Active"
                                                        : "Inactive"}
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
                                                                        "admin.stores.edit",
                                                                        store.id,
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
                                                                setStoreToDelete(
                                                                    store,
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
                open={!!storeToDelete}
                onOpenChange={(open) => !open && setStoreToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this store?</DialogTitle>
                        <DialogDescription>
                            {storeToDelete && (
                                <>
                                    "{storeToDelete.name}" will be permanently
                                    deleted. This cannot be undone.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStoreToDelete(null)}
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
