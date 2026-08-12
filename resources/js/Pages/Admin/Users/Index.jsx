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

export default function Index({ users }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [userToDelete, setUserToDelete] = useState(null);

    const ROLE_LABELS = {
        admin: at("role_admin", uiLocale),
        staff: at("role_staff", uiLocale),
        customer: at("role_customer", uiLocale),
    };

    useEffect(() => {
        if (flash?.success) toast.success(at(flash.success, uiLocale));
        if (flash?.error) toast.error(at(flash.error, uiLocale));
    }, [flash]);

    const confirmDelete = () => {
        router.delete(route("admin.users.destroy", userToDelete.id), {
            onSuccess: () => setUserToDelete(null),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("users", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("users", uiLocale)}
                </h2>
            }
        >
            <Head title={at("users", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {toFa(users.total, uiLocale)}{" "}
                            {users.total === 1
                                ? at("user_singular", uiLocale)
                                : at("users_count", uiLocale)}
                        </p>

                        <Button
                            nativeButton={false}
                            render={<Link href={route("admin.users.create")} />}
                        >
                            <Plus className="me-1.5 size-4" />
                            {at("add_user", uiLocale)}
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
                                            {at("email_field", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("role", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("store", uiLocale)}
                                        </TableHead>
                                        <TableHead>
                                            {at("status", uiLocale)}
                                        </TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                {at("no_users_yet", uiLocale)}
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="align-middle font-medium text-foreground">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge variant="outline">
                                                    {ROLE_LABELS[user.role]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="align-middle text-muted-foreground">
                                                {user.store?.name ?? "—"}
                                            </TableCell>
                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        user.is_active
                                                            ? "bg-status-available/15 text-status-available border-status-available/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }
                                                >
                                                    {user.is_active
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
                                                                        "admin.users.edit",
                                                                        user.id,
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
                                                                setUserToDelete(
                                                                    user,
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
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {at("delete_user_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {userToDelete && `"${userToDelete.name}"`}{" "}
                            {at("delete_user_confirm_desc", uiLocale)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setUserToDelete(null)}
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
