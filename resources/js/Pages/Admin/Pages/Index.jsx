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

export default function Index({ pages }) {
    const { flash } = usePage().props;
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
                { label: "Dashboard", href: route("dashboard") },
                { label: "Pages" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Pages
                </h2>
            }
        >
            <Head title="Pages" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {pages.length}{" "}
                            {pages.length === 1 ? "page" : "pages"}
                        </p>

                        <Button
                            nativeButton={false}
                            render={<Link href={route("admin.pages.create")} />}
                        >
                            <Plus className="mr-1.5 size-4" />
                            Add page
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Status</TableHead>
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
                                                No pages yet. Add the first one
                                                to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {pages.map((page) => (
                                        <TableRow key={page.id}>
                                            <TableCell className="font-medium text-foreground">
                                                {page.title.en}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                /pages/{page.slug}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        page.is_published
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {page.is_published
                                                        ? "Published"
                                                        : "Draft"}
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
                                                        {page.is_published && (
                                                            <DropdownMenuItem
                                                                nativeButton={
                                                                    false
                                                                }
                                                                render={
                                                                    <a
                                                                        href={route(
                                                                            "pages.show",
                                                                            page.slug,
                                                                        )}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    />
                                                                }
                                                            >
                                                                <ExternalLink className="mr-2 size-4" />
                                                                View
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
                                                            <Pencil className="mr-2 size-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setPageToDelete(
                                                                    page,
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
                open={!!pageToDelete}
                onOpenChange={(open) => !open && setPageToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this page?</DialogTitle>
                        <DialogDescription>
                            {pageToDelete && (
                                <>
                                    "{pageToDelete.title}" will be permanently
                                    deleted. This cannot be undone.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPageToDelete(null)}
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
