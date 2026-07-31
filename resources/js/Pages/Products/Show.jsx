import { useState } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { ArrowLeft, ImageOff, MapPin, ShieldCheck } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { t } from "@/lib/translate";

const CONDITION_LABELS = {
    new: "New",
    used: "Used",
    refurbished: "Refurbished",
};

export default function Show({ product, relatedProducts }) {
    const { locale } = usePage().props;

    const images = product.images ?? [];
    const [activeImage, setActiveImage] = useState(images[0] ?? null);
    const [contactOpen, setContactOpen] = useState(false);

    const productTitle = t(product.title, locale);
    const productDescription = t(product.description, locale);
    const categoryName = t(product.category?.name, locale);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: "quote_request",
        name: "",
        email: "",
        phone: "",
        message: "",
        product_id: product.id,
        store_id: product.store?.id ?? null,
    });

    const submitContact = (e) => {
        e.preventDefault();
        post(route("contact-requests.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setContactOpen(false);
                reset("name", "email", "phone", "message");
            },
        });
    };

    return (
        <PublicLayout>
            <Head title={productTitle || product.reference} />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={route("products.index")} />}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-1.5 size-4" />
                    Back to results
                </Button>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[28rem_1fr] lg:gap-12">
                    {/* گالری تصاویر */}
                    <div className="self-start">
                        <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                            {activeImage ? (
                                <img
                                    src={`/storage/${activeImage.url}`}
                                    alt={productTitle}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <ImageOff className="size-12 text-muted-foreground" />
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="mt-3 flex gap-2">
                                {images.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setActiveImage(image)}
                                        className={`size-16 overflow-hidden rounded-md border-2 transition-colors ${
                                            activeImage?.id === image.id
                                                ? "border-primary"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${image.url}`}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* جزئیات */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline">
                                {CONDITION_LABELS[product.condition]}
                            </Badge>
                            {product.is_checked && (
                                <Badge
                                    variant="outline"
                                    className="bg-status-available/15 text-status-available border-status-available/30"
                                >
                                    <ShieldCheck className="mr-1 size-3" />
                                    Checked by Ophtazon
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            {productTitle}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Ref: {product.reference}
                        </p>

                        <p className="mt-4 text-3xl font-bold text-foreground">
                            {product.price} {product.currency}
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <motion.div
                                whileTap={{ scale: 0.96 }}
                                className="inline-block"
                            >
                                <Button
                                    variant="default"
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                        router.post(
                                            route("cart.store"),
                                            { product_id: product.id },
                                            {
                                                preserveScroll: true,
                                            },
                                        );
                                    }}
                                >
                                    <ShoppingCart className="mr-1.5 size-4" />
                                    Add to cart
                                </Button>
                            </motion.div>

                            <motion.div
                                whileTap={{ scale: 0.96 }}
                                className="inline-block"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={() => setContactOpen(true)}
                                >
                                    Contact seller
                                </Button>
                            </motion.div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">
                                    Category
                                </p>
                                <p className="font-medium text-foreground">
                                    {categoryName || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Brand</p>
                                <p className="font-medium text-foreground">
                                    {product.brand?.name ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Manufacture year
                                </p>
                                <p className="font-medium text-foreground">
                                    {product.manufacture_year ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Warranty
                                </p>
                                <p className="font-medium text-foreground">
                                    {product.warranty_months > 0
                                        ? `${product.warranty_months} months`
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                    <MapPin className="size-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">
                                        {product.store?.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {product.store?.country?.name}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {productDescription && (
                    <div className="mt-10 max-w-3xl">
                        <h2 className="mb-3 text-lg font-semibold text-foreground">
                            Description
                        </h2>
                        <p className="whitespace-pre-line text-muted-foreground">
                            {productDescription}
                        </p>
                    </div>
                )}

                {/* محصولات مرتبط */}
                {relatedProducts?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            Related Equipment
                        </h2>

                        <Carousel opts={{ align: "start" }} className="px-1">
                            <CarouselContent>
                                {relatedProducts.map((related) => (
                                    <CarouselItem
                                        key={related.id}
                                        className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
                                    >
                                        <Link
                                            href={route(
                                                "products.show",
                                                related.slug,
                                            )}
                                        >
                                            <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
                                                <div className="flex h-48 items-center justify-center overflow-hidden bg-muted">
                                                    {related.images?.[0] ? (
                                                        <motion.img
                                                            whileHover={{
                                                                scale: 1.08,
                                                            }}
                                                            transition={{
                                                                duration: 0.4,
                                                            }}
                                                            src={`/storage/${related.images[0].url}`}
                                                            alt={t(
                                                                related.title,
                                                                locale,
                                                            )}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageOff className="size-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <CardContent className="space-y-1 p-3">
                                                    <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                                                        {t(
                                                            related.title,
                                                            locale,
                                                        )}
                                                    </h3>
                                                    <p className="font-semibold text-foreground">
                                                        {related.price}{" "}
                                                        {related.currency}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                    </div>
                )}
            </div>

            {/* Dialog تماس با فروشنده */}
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Contact seller</DialogTitle>
                        <DialogDescription>
                            Ask about "{productTitle}". We'll pass your message
                            to {product.store?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitContact} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="contact_name">Your name</Label>
                            <Input
                                id="contact_name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contact_email">Email</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contact_phone">
                                Phone (optional)
                            </Label>
                            <Input
                                id="contact_phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contact_message">
                                Message (optional)
                            </Label>
                            <Textarea
                                id="contact_message"
                                rows={3}
                                value={data.message}
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setContactOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Sending..." : "Send message"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
