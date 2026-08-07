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
import { at } from "@/lib/admin-i18n";
import { toFa } from "@/lib/toFa";

export default function Index({ brands }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [brandToDelete, setBrandToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.brands.destroy", brandToDelete.id), {
            onSuccess: () => setBrandToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("brands", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("brands", uiLocale)}
                </h2>
            }
        >
            <Head title={at("brands", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {toFa(brands.length, uiLocale)}{" "}
                            {brands.length === 1
                                ? at("brand_singular", uiLocale)
                                : at("brands_count", uiLocale)}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.brands.create")} />
                            }
                        >
                            <Plus className="me-1.5 size-4" />
                            {at("add_brand", uiLocale)}
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
                                            {at("products_count_col", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {brands.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                {at("no_brands_yet", uiLocale)}
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {brands.map((brand) => (
                                        <TableRow key={brand.id}>
                                            <TableCell className="align-middle font-medium">
                                                {brand.name}
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {toFa(
                                                    brand.products_count,
                                                    uiLocale,
                                                )}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        brand.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {brand.is_active
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
                                                                        "admin.brands.edit",
                                                                        brand.id,
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
                                                                setBrandToDelete(
                                                                    brand,
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
                open={!!brandToDelete}
                onOpenChange={(open) => !open && setBrandToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {at("delete_brand_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {brandToDelete && `"${brandToDelete.name}"`}{" "}
                            {at("delete_brand_confirm_desc", uiLocale)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBrandToDelete(null)}
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
