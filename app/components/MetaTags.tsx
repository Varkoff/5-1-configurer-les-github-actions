export function MetaTags({
    description,
    title,
    imageUrl = 'https://algomax.fr/images/me-converted.webp',
}: {
    title: string;
    description: string;
    imageUrl?: string;
}) {
    return (
        <>
            <title>{title}</title>
            <meta property='og:title' content={title} />
            <meta name='description' content={description} />
            <meta property='og:description' content={description} />
            <meta property='og:image' content={imageUrl} />
        </>
    );
}
