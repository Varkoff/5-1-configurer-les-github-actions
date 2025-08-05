
import type { Article } from "schema-dts"
import type { fetchArticle } from "~/server/articles.server"
export function ArticleStructuredData({ article }: {
    article: Awaited<ReturnType<typeof fetchArticle>>
}) {
    const structuredData: Article = {
        "@type": "BlogPosting",
        headline: article?.title,
        dateCreated: article?.dateCreated.toISOString(),
        image: article?.image,
        description: article?.description,
        author: {
            "@type": "Person",
            name: article?.author
        }

    }

    return <>

        <script type="application/ld+json">
            {JSON.stringify(structuredData)}
        </script>
    </>
}