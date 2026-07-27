import { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";

const TYPE_LABELS = {
    hero: "Hero Banner",
    categories: "Category Grid",
    latest_products: "Latest Listings",
    custom_content: "Custom Content",
};

export default function Index({ sections }) {
    const { flash } = usePage().props;
    const [sectionToDelete, setSectionToDelete] = useState(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const move = (section, direction) => {
        router.post(
            route("admin.page-sections.move", section.id),
            { direction },
            { preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        router.delete(
            route("admin.page-sections.destroy", sectionToDelete.id),
            {
                onSuccess: () => setSectionToDelete(null),
            },
        );
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: "Dashboard", href: route("dashboard") },
                { label: "Homepage" },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Homepage Sections
                </h2>
            }
        >
            <Head title="Homepage Sections" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Sections appear on the homepage in this order.
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link
                                    href={route("admin.page-sections.create")}
                                />
                            }
                        >
                            <Plus className="mr-1.5 size-4" />
                            Add section
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {sections.length === 0 && (
                            <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                                No sections yet. Add the first one to build your
                                homepage.
                            </div>
                        )}

                        {sections.map((section, index) => (
                            <Card key={section.id}>
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="flex flex-col">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-6"
                                            disabled={index === 0}
                                            onClick={() => move(section, "up")}
                                        >
                                            <ChevronUp className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-6"
                                            disabled={
                                                index === sections.length - 1
                                            }
                                            onClick={() =>
                                                move(section, "down")
                                            }
                                        >
                                            <ChevronDown className="size-4" />
                                        </Button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-foreground">
                                                {TYPE_LABELS[section.type]}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    section.is_active
                                                        ? "bg-status-available/15 text-status-available border-status-available/30"
                                                        : "bg-muted text-muted-foreground border-border"
                                                }
                                            >
                                                {section.is_active
                                                    ? "Visible"
                                                    : "Hidden"}
                                            </Badge>
                                        </div>
                                        {section.content?.title && (
                                            <p className="text-sm text-muted-foreground">
                                                {section.content.title}
                                            </p>
                                        )}
                                        {section.content?.heading && (
                                            <p className="text-sm text-muted-foreground">
                                                {section.content.heading}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={route(
                                                    "admin.page-sections.edit",
                                                    section.id,
                                                )}
                                            />
                                        }
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setSectionToDelete(section)
                                        }
                                    >
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog
                open={!!sectionToDelete}
                onOpenChange={(open) => !open && setSectionToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this section?</DialogTitle>
                        <DialogDescription>
                            {sectionToDelete && (
                                <>
                                    This "{TYPE_LABELS[sectionToDelete.type]}"
                                    section will be permanently removed from the
                                    homepage.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSectionToDelete(null)}
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
