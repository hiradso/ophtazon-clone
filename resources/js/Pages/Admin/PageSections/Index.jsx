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
import { at } from "@/lib/admin-i18n";

function typeLabel(type, uiLocale) {
    return at(`type_${type}`, uiLocale);
}

export default function Index({ sections: initialSections }) {
    const { flash, locale: uiLocale } = usePage().props;
    const [sections, setSections] = useState(initialSections);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    useEffect(() => {
        setSections(initialSections);
    }, [initialSections]);

    useEffect(() => {
        if (flash?.success) toast.success(at(flash.success, uiLocale));
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
                { label: at("dashboard", uiLocale), href: route("dashboard") },
                { label: at("homepage_sections", uiLocale) },
            ]}
            header={
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {at("homepage_sections", uiLocale)}
                </h2>
            }
        >
            <Head title={at("homepage_sections", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {at("reorder_hint", uiLocale)}
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link
                                    href={route("admin.page-sections.create")}
                                />
                            }
                        >
                            <Plus className="me-1.5 size-4" />
                            {at("add_section", uiLocale)}
                        </Button>
                    </div>

                    {sections.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                            {at("no_sections_yet", uiLocale)}
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
                                            uiLocale={uiLocale}
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
                        <DialogTitle>
                            {at("delete_section_confirm_title", uiLocale)}
                        </DialogTitle>
                        <DialogDescription>
                            {sectionToDelete && (
                                <>
                                    "{typeLabel(sectionToDelete.type, uiLocale)}
                                    "{" "}
                                    {at(
                                        "delete_section_confirm_desc",
                                        uiLocale,
                                    )}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSectionToDelete(null)}
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

function SortableSectionCard({ section, uiLocale, onDelete }) {
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
                                {typeLabel(section.type, uiLocale)}
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
                                    ? at("visible", uiLocale)
                                    : at("hidden", uiLocale)}
                            </Badge>
                        </div>
                        {section.content?.title?.en && (
                            <p className="text-sm text-muted-foreground">
                                {section.content.title.en}
                            </p>
                        )}
                        {section.content?.heading?.en && (
                            <p className="text-sm text-muted-foreground">
                                {section.content.heading.en}
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
