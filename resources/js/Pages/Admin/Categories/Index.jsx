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

export default function Index({ categories }) {
    const { flash } = usePage().props;
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.categories.destroy", categoryToDelete.id), {
            onSuccess: () => setCategoryToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Categories" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Categories
                </h2>
            }
        >
            <Head title="Categories" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {categories.length}{" "}
                            {categories.length === 1
                                ? "category"
                                : "categories"}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.categories.create")} />
                            }
                        >
                            <Plus className="mr-1.5 size-4" />
                            Add category
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Parent</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                No categories yet. Add the first
                                                one to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {category.name.en}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {category.slug}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {categories.find(
                                                    (c) =>
                                                        c.id ===
                                                        category.parent_id,
                                                )?.name.en ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {category.products_count}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        category.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {category.is_active
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
                                                                        "admin.categories.edit",
                                                                        category.id,
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
                                                                setCategoryToDelete(
                                                                    category,
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
                open={!!categoryToDelete}
                onOpenChange={(open) => !open && setCategoryToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this category?</DialogTitle>
                        <DialogDescription>
                            {categoryToDelete && (
                                <>
                                    "{categoryToDelete.name.en}" will be
                                    permanently deleted. This cannot be undone.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCategoryToDelete(null)}
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
