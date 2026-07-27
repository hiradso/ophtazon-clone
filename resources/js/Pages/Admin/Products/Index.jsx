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
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";

// این آبجکت تنها جایی است که رنگ هر وضعیت به کلاس Tailwind وصل می‌شود.
// خودِ رنگ‌ها در resources/css/app.css قابل تغییرند؛ این‌جا فقط اسم وضعیت‌ها هستند.
const statusColor = {
    draft: "bg-status-draft/15 text-status-draft border-status-draft/30",
    pending_review:
        "bg-status-pending/15 text-status-pending border-status-pending/30",
    available:
        "bg-status-available/15 text-status-available border-status-available/30",
    reserved:
        "bg-status-reserved/15 text-status-reserved border-status-reserved/30",
    sold: "bg-status-sold/15 text-status-sold border-status-sold/30",
    archived:
        "bg-status-archived/15 text-status-archived border-status-archived/30",
};

export default function Index({ products }) {
    const { flash } = usePage().props;
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.products.destroy", productToDelete.id), {
            onSuccess: () => setProductToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Products" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {products.total}{" "}
                            {products.total === 1 ? "product" : "products"}{" "}
                            total
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.products.create")} />
                            }
                        >
                            <Plus className="mr-1.5 size-4" />
                            Add product
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Store</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                No products yet. Add the first
                                                one to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="text-muted-foreground">
                                                {product.reference}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.title.en}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {product.category?.name?.en ??
                                                    "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {product.store?.name ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {product.price}{" "}
                                                {product.currency}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        statusColor[
                                                            product.status
                                                        ] ?? ""
                                                    }
                                                >
                                                    {product.status.replace(
                                                        "_",
                                                        " ",
                                                    )}
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
                                                                        "admin.products.show",
                                                                        product.id,
                                                                    )}
                                                                />
                                                            }
                                                        >
                                                            <Eye className="mr-2 size-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            render={
                                                                <Link
                                                                    href={route(
                                                                        "admin.products.edit",
                                                                        product.id,
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
                                                                setProductToDelete(
                                                                    product,
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

                    {products.links.length > 3 && (
                        <div className="mt-6 flex flex-wrap gap-1">
                            {products.links.map((link, index) =>
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
                open={!!productToDelete}
                onOpenChange={(open) => !open && setProductToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this product?</DialogTitle>
                        <DialogDescription>
                            {productToDelete && (
                                <>
                                    "{productToDelete.title.en}" will be moved
                                    to trash and can be restored later by an
                                    admin.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setProductToDelete(null)}
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
