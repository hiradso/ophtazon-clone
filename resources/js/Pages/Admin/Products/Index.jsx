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
import {
    Plus,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    ImageOff,
    Tag,
    PackageX,
} from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { hasDiscount } from "@/lib/pricing";
import Price from "@/Components/Price";
import { at } from "@/lib/admin-i18n";
import { toFa } from "@/lib/toFa";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// این آبجکت تنها جایی است که رنگ هر وضعیت به کلاس Tailwind وصل می‌شود.
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
    const { flash, locale: uiLocale } = usePage().props;
    const [productToDelete, setProductToDelete] = useState(null);

    const STATUS_LABELS = {
        draft: at("status_draft", uiLocale),
        pending_review: at("status_pending_review", uiLocale),
        available: at("status_available", uiLocale),
        reserved: at("status_reserved", uiLocale),
        sold: at("status_sold", uiLocale),
        archived: at("status_archived", uiLocale),
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(at(flash.success, uiLocale));
        }
        if (flash?.error) {
            toast.error(at(flash.error, uiLocale));
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
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("products", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("products", uiLocale)}
                </h2>
            }
        >
            <Head title={at("products", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {toFa(products.total, uiLocale)}{" "}
                            {at("total", uiLocale)}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.products.create")} />
                            }
                        >
                            <Plus className="me-1.5 size-4" />
                            {at("add", uiLocale)} {at("products", uiLocale)}
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-20"></TableHead>
                                        <TableHead>
                                            {at("title", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("price", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("stock", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
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

                                    {products.data.map((product) => {
                                        const discounted = hasDiscount(
                                            product.discount_percentage,
                                        );

                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell className="align-middle">
                                                    {product.images?.[0] ? (
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                render={
                                                                    <div className="relative h-16 w-16 shrink-0 cursor-zoom-in overflow-hidden rounded-md ring-1 ring-border transition-transform duration-200 ease-out hover:z-10 hover:scale-110 hover:shadow-lg">
                                                                        <img
                                                                            src={`/storage/${product.images[0].url}`}
                                                                            alt=""
                                                                            className="absolute inset-0 h-full w-full object-cover"
                                                                        />
                                                                    </div>
                                                                }
                                                            />
                                                            <TooltipContent
                                                                side="right"
                                                                className="rounded-lg border border-border bg-popover p-1.5 shadow-2xl"
                                                            >
                                                                <img
                                                                    src={`/storage/${product.images[0].url}`}
                                                                    alt=""
                                                                    className="max-h-72 max-w-72 rounded-md object-cover"
                                                                />
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ) : (
                                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                            <ImageOff className="size-5" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-64 align-middle">
                                                    <p className="truncate font-medium text-foreground">
                                                        {product.title.en}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {product.reference}
                                                        {product.category
                                                            ?.name?.en &&
                                                            ` · ${product.category.name.en}`}
                                                        {product.store
                                                            ?.name &&
                                                            ` · ${product.store.name}`}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="align-middle">
                                                    {discounted ? (
                                                        <div className="flex flex-col text-sm">
                                                            <Price
                                                                amount={
                                                                    product.price
                                                                }
                                                                currency={
                                                                    product.currency
                                                                }
                                                                locale={
                                                                    uiLocale
                                                                }
                                                                className="text-xs text-muted-foreground line-through"
                                                            />
                                                            <Price
                                                                amount={
                                                                    product.effective_price
                                                                }
                                                                currency={
                                                                    product.currency
                                                                }
                                                                locale={
                                                                    uiLocale
                                                                }
                                                                className="font-medium text-foreground"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Price
                                                            amount={
                                                                product.price
                                                            }
                                                            currency={
                                                                product.currency
                                                            }
                                                            locale={uiLocale}
                                                            className="text-muted-foreground"
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell className="align-middle">
                                                    {(() => {
                                                        const stock =
                                                            product.stock_quantity ??
                                                            0;
                                                        if (stock === 0) {
                                                            return (
                                                                <span className="inline-flex items-center gap-1 text-sm font-medium text-destructive">
                                                                    <PackageX className="size-3.5" />
                                                                    {toFa(
                                                                        0,
                                                                        uiLocale,
                                                                    )}
                                                                </span>
                                                            );
                                                        }
                                                        if (stock <= 5) {
                                                            return (
                                                                <span className="text-sm font-medium text-status-pending">
                                                                    {toFa(
                                                                        stock,
                                                                        uiLocale,
                                                                    )}
                                                                </span>
                                                            );
                                                        }
                                                        return (
                                                            <span className="text-sm text-muted-foreground">
                                                                {toFa(
                                                                    stock,
                                                                    uiLocale,
                                                                )}
                                                            </span>
                                                        );
                                                    })()}
                                                </TableCell>
                                                <TableCell className="align-middle">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                statusColor[
                                                                    product
                                                                        .status
                                                                ] ?? ""
                                                            }
                                                        >
                                                            {
                                                                STATUS_LABELS[
                                                                    product
                                                                        .status
                                                                ]
                                                            }
                                                        </Badge>
                                                        {discounted && (
                                                            <Badge className="bg-destructive text-white">
                                                                <Tag className="me-1 size-3" />
                                                                {at(
                                                                    "discounted",
                                                                    uiLocale,
                                                                )}
                                                            </Badge>
                                                        )}
                                                    </div>
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
                                                                            "admin.products.show",
                                                                            product.id,
                                                                        )}
                                                                    />
                                                                }
                                                            >
                                                                <Eye className="me-2 size-4" />
                                                                {at(
                                                                    "view",
                                                                    uiLocale,
                                                                )}
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
                                                                <Pencil className="me-2 size-4" />
                                                                {at(
                                                                    "edit",
                                                                    uiLocale,
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    setProductToDelete(
                                                                        product,
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
                                        );
                                    })}
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
                        <DialogTitle>
                            {at("delete_product_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {productToDelete && (
                                <>
                                    "{productToDelete.title.en}"{" "}
                                    {at(
                                        "delete_product_confirm_desc",
                                        uiLocale,
                                    )}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setProductToDelete(null)}
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
