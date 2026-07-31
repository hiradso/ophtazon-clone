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
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TYPE_LABELS = {
    hero: "Hero Banner",
    categories: "Category Grid",
    latest_products: "Latest Listings",
    custom_content: "Custom Content",
};

export default function Index({ sections: initialSections }) {
    const { flash } = usePage().props;
    const [sections, setSections] = useState(initialSections);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    // اگر داده‌ی سرور (مثلاً بعد از حذف) تغییر کرد، state محلی را هم به‌روز کن
    useEffect(() => {
        setSections(initialSections);
    }, [initialSections]);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        const reordered = arrayMove(sections, oldIndex, newIndex);

        // به‌روزرسانی فوری و خوش‌بینانه‌ی ظاهر، قبل از پاسخ سرور
        setSections(reordered);

        router.post(
            route("admin.page-sections.reorder"),
            { order: reordered.map((s) => s.id) },
            { preserveScroll: true, preserveState: true },
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
                            Drag sections to reorder how they appear on the
                            homepage.
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

                    {sections.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                            No sections yet. Add the first one to build your
                            homepage.
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sections.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {sections.map((section) => (
                                        <SortableSectionCard
                                            key={section.id}
                                            section={section}
                                            onDelete={() =>
                                                setSectionToDelete(section)
                                            }
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
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

function SortableSectionCard({ section, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card>
                <CardContent className="flex items-center gap-3 p-4">
                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
                    >
                        <GripVertical className="size-5" />
                    </button>

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
                                {section.is_active ? "Visible" : "Hidden"}
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
                    <Button variant="ghost" size="icon" onClick={onDelete}>
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
