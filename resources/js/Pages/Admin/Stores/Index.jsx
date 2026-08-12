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
import { at } from "@/lib/admin-i18n";
import { toFa } from "@/lib/toFa";

export default function Index({ stores }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [storeToDelete, setStoreToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) toast.success(at(flash.success, uiLocale));
        if (flash?.error) toast.error(at(flash.error, uiLocale));
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.stores.destroy", storeToDelete.id), {
            onSuccess: () => setStoreToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("stores", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("stores", uiLocale)}
                </h2>
            }
        >
            <Head title={at("stores", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {stores.length}{" "}
                            {stores.length === 1
                                ? at("store_singular", uiLocale)
                                : at("stores_count", uiLocale)}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.stores.create")} />
                            }
                        >
                            <Plus className="me-1.5 size-4" />
                            {at("add_store", uiLocale)}
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {at("name_field", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("country", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("email_field", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("products_count_col", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
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
                                                {at("no_stores_yet", uiLocale)}
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {stores.map((store) => (
                                        <TableRow key={store.id}>
                                            <TableCell className="align-middle font-medium">
                                                {store.name}
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {store.country?.name ?? "—"}
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {store.email ?? "—"}
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {toFa(
                                                    store.products_count,
                                                    uiLocale,
                                                )}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        store.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {store.is_active
                                                        ? at("active", uiLocale)
                                                        : at(
                                                              "hidden",
                                                              uiLocale,
                                                          )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="align-middle">
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
                                                            <Pencil className="me-2 size-4" />
                                                            {at(
                                                                "edit",
                                                                uiLocale,
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setStoreToDelete(
                                                                    store,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="me-2 size-4" />
                                                            {at(
                                                                "delete",
                                                                uiLocale,
                                                            )}
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
                        <DialogTitle>
                            {at("delete_store_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {storeToDelete && `"${storeToDelete.name}"`}{" "}
                            {at("delete_store_confirm_desc", uiLocale)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStoreToDelete(null)}
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
