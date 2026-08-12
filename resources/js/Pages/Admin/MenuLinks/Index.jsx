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
import { Plus, MoreHorizontal, Pencil, Trash2, CornerDownRight } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { toFa } from "@/lib/toFa";
import { stripHtml } from "@/lib/richText";

function orderWithChildren(menuLinks) {
    const topLevel = menuLinks.filter((link) => !link.parent_id);
    const ordered = [];

    for (const link of topLevel) {
        ordered.push(link);
        for (const child of menuLinks.filter(
            (candidate) => candidate.parent_id === link.id,
        )) {
            ordered.push(child);
        }
    }

    return ordered;
}

export default function Index({ menuLinks }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [linkToDelete, setLinkToDelete] = useState(null);
    const orderedLinks = orderWithChildren(menuLinks);

    useEffect(() => {
        if (flash?.success) toast.success(at(flash.success, uiLocale));
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.menu-links.destroy", linkToDelete.id), {
            onSuccess: () => setLinkToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("menu_links", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("menu_links", uiLocale)}
                </h2>
            }
        >
            <Head title={at("menu_links", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {toFa(menuLinks.length, uiLocale)}{" "}
                            {at("total", uiLocale)}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={route("admin.menu-links.create")} />
                            }
                        >
                            <Plus className="me-1.5 size-4" />
                            {at("add_link", uiLocale)}
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {at("location", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("footer_column", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("label", uiLocale)}
                                        </TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
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
                                                {at("no_links_yet", uiLocale)}
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {orderedLinks.map((link) => (
                                        <TableRow key={link.id}>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {link.location === "header"
                                                        ? at(
                                                              "top_navigation",
                                                              uiLocale,
                                                          )
                                                        : at(
                                                              "footer",
                                                              uiLocale,
                                                          )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {link.group_label?.en ?? "—"}
                                            </TableCell>
                                            <TableCell className="align-middle font-medium text-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    {link.parent_id && (
                                                        <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground rtl:-scale-x-100" />
                                                    )}
                                                    {link.label?.en}
                                                </span>
                                            </TableCell>
                                            <TableCell className="align-middle max-w-48 truncate text-muted-foreground">
                                                {link.page
                                                    ? `${at("existing_page", uiLocale)}: ${stripHtml(link.page.title?.en)}`
                                                    : link.url}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        link.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {link.is_active
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
                                                                        "admin.menu-links.edit",
                                                                        link.id,
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
                                                                setLinkToDelete(
                                                                    link,
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
                open={!!linkToDelete}
                onOpenChange={(open) => !open && setLinkToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {at("delete_link_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {linkToDelete && (
                                <>
                                    "{linkToDelete.label?.en}"{" "}
                                    {at("delete_link_confirm_desc", uiLocale)}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setLinkToDelete(null)}
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
