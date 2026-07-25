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
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ brands }) {
    const { flash } = usePage().props;
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
                { label: "Dashboard", href: route("dashboard") },
                { label: "Brands" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Brands
                </h2>
            }
        >
            <Head title="Brands" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {brands.length}{" "}
                            {brands.length === 1 ? "brand" : "brands"}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.brands.create")} />
                            }
                        >
                            <Plus className="mr-1.5 size-4" />
                            Add brand
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Status</TableHead>
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
                                                No brands yet. Add the first one
                                                to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {brands.map((brand) => (
                                        <TableRow key={brand.id}>
                                            <TableCell className="font-medium">
                                                {brand.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {brand.products_count}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        brand.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {brand.is_active
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
                                                                        "admin.brands.edit",
                                                                        brand.id,
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
                                                                setBrandToDelete(
                                                                    brand,
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
                open={!!brandToDelete}
                onOpenChange={(open) => !open && setBrandToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this brand?</DialogTitle>
                        <DialogDescription>
                            {brandToDelete && (
                                <>
                                    "{brandToDelete.name}" will be permanently
                                    deleted. This cannot be undone.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBrandToDelete(null)}
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
