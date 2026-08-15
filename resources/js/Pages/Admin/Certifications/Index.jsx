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
import { Plus, MoreHorizontal, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { toFa } from "@/lib/toFa";

export default function Index({ certifications }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [certificationToDelete, setCertificationToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) toast.success(at(flash.success, uiLocale));
        if (flash?.error) toast.error(at(flash.error, uiLocale));
    }, [flash]);

    const confirmDelete = () => {
        router.delete(
            route("admin.certifications.destroy", certificationToDelete.id),
            { onSuccess: () => setCertificationToDelete(null) },
        );
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("certifications", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("certifications", uiLocale)}
                </h2>
            }
        >
            <Head title={at("certifications", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {toFa(certifications.length, uiLocale)}{" "}
                            {certifications.length === 1
                                ? at("certification_singular", uiLocale)
                                : at("certifications", uiLocale)}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link
                                    href={route(
                                        "admin.certifications.create",
                                    )}
                                />
                            }
                        >
                            <Plus className="me-1.5 size-4" />
                            {at("add_certification", uiLocale)}
                        </Button>
                    </div>

                    <Card className="overflow-hidden py-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-14"></TableHead>
                                        <TableHead>
                                            {at("name_field", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("issuing_body", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {certifications.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                {at(
                                                    "no_certifications_yet",
                                                    uiLocale,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {certifications.map((certification) => (
                                        <TableRow key={certification.id}>
                                            <TableCell className="align-middle">
                                                <div className="flex size-9 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                                                    {certification.image ? (
                                                        <img
                                                            src={`/storage/${certification.image}`}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ShieldCheck className="size-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-middle font-medium">
                                                {certification.name.en}
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {certification.issuing_body
                                                    ?.en || "—"}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        certification.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {certification.is_active
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
                                                                        "admin.certifications.edit",
                                                                        certification.id,
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
                                                                setCertificationToDelete(
                                                                    certification,
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
                open={!!certificationToDelete}
                onOpenChange={(open) => !open && setCertificationToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {at("delete_certification_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {certificationToDelete &&
                                `"${certificationToDelete.name.en}"`}{" "}
                            {at(
                                "delete_certification_confirm_desc",
                                uiLocale,
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCertificationToDelete(null)}
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
