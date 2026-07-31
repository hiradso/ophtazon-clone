import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Show({ page }) {
    const hasBackgroundImage =
        page.featured_image && page.image_display_style === "background";
    const hasBannerImage =
        page.featured_image && page.image_display_style === "banner";

    return (
        <PublicLayout>
            <Head title={page.title.en}>
                {page.meta_description?.en && (
                    <meta
                        name="description"
                        content={page.meta_description.en}
                    />
                )}
            </Head>
            {hasBackgroundImage ? (
                <div
                    className="relative flex h-80 items-end bg-cover bg-center sm:h-96"
                    style={{
                        backgroundImage: `url(/storage/${page.featured_image})`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            {page.title.en}
                        </h1>
                    </div>
                </div>
            ) : null}
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                {!hasBackgroundImage && (
                    <h1 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
                        {page.title.en}
                    </h1>
                )}
                {hasBannerImage && (
                    <img
                        src={`/storage/${page.featured_image}`}
                        alt=""
                        className="mb-6 h-64 w-full rounded-lg object-cover"
                    />
                )}
                <div
                    className="prose prose-neutral max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: page.content?.en ?? "" }}
                />
            </div>
        </PublicLayout>
    );
}
