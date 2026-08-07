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
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    ExternalLink,
} from "lucide-react";
import { toFa } from "@/lib/toFa";
import { at } from "@/lib/admin-i18n";

export default function Index({ pages }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [pageToDelete, setPageToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.pages.destroy", pageToDelete.id), {
            onSuccess: () => setPageToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("pages", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("pages", uiLocale)}
                </h2>
            }
        >
            <Head title={at("pages", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {toFa(pages.length, uiLocale)}{" "}
                            {pages.length === 1
                                ? at("page_singular", uiLocale)
                                : at("pages_count", uiLocale)}
                        </p>

                        <Button
                            nativeButton={false}
                            render={<Link href={route("admin.pages.create")} />}
                        >
                            <Plus className="me-1.5 size-4" />
                            {at("add_page", uiLocale)}
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {at("title", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("slug", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pages.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                {at("no_pages_yet", uiLocale)}
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {pages.map((page) => (
                                        <TableRow key={page.id}>
                                            <TableCell className="align-middle font-medium text-foreground">
                                                {page.title.en}
                                            </TableCell>
                                            <TableCell
                                                className="align-middle text-muted-foreground"
                                                dir="ltr"
                                            >
                                                /pages/{page.slug}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        page.is_published
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {page.is_published
                                                        ? at(
                                                              "published",
                                                              uiLocale,
                                                          )
                                                        : at(
                                                              "status_draft",
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
                                                        {page.is_published && (
                                                            <DropdownMenuItem
                                                                nativeButton={
                                                                    false
                                                                }
                                                                render={
                                                                    <a
                                                                        href={route(
                                                                            "pages.show",
                                                                            {
                                                                                locale: uiLocale,
                                                                                page: page.slug,
                                                                            },
                                                                        )}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    />
                                                                }
                                                            >
                                                                <ExternalLink className="me-2 size-4" />
                                                                {at(
                                                                    "view",
                                                                    uiLocale,
                                                                )}
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            render={
                                                                <Link
                                                                    href={route(
                                                                        "admin.pages.edit",
                                                                        page.id,
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
                                                                setPageToDelete(
                                                                    page,
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
                open={!!pageToDelete}
                onOpenChange={(open) => !open && setPageToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {at("delete_page_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {pageToDelete && `"${pageToDelete.title.en}"`}{" "}
                            {at("delete_page_confirm_desc", uiLocale)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPageToDelete(null)}
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
