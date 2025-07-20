import { useLoaderData } from 'react-router';
import { MetaTags } from '~/components/MetaTags';
import { fetchArticle } from '~/server/articles.server';
import type { Route } from "./+types/blog.$slug";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const article = await fetchArticle({
        slug: params.slug
    })
    if (!article) {
        throw new Response(`L'article ${params.slug} n'a pas été retrouvé`, { status: 404 })
    }
    return article;
}

export default function ArticlePage() {
    const article = useLoaderData<typeof loader>()
    return (
        <>
            <MetaTags
                title={article.title}
                description={article.description}
                imageUrl={article.image}
            />
            <main className='max-w-4xl mx-auto px-6 py-12'>
                {/* Header de l'article */}
                <header className='mb-12'>
                    <div className='mb-6'>
                        <a
                            href='/blog'
                            className='inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-6'
                        >
                            ← Retour au blog
                        </a>
                    </div>

                    <h1 className='text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
                        {article.title}
                    </h1>

                    <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
                        {article.description}
                    </p>

                    <div className='flex items-center gap-4 text-sm text-gray-500 mb-8'>
                        <span>Article #{article.id}</span>
                        <span>•</span>
                        <span>Par Virgile</span>
                        <span>•</span>
                        <span>5 min de lecture</span>
                    </div>
                </header>

                {/* Image de l'article */}
                <div className='mb-12'>
                    <img
                        src={article.image}
                        alt={article.title}
                        className='w-full h-80 lg:h-96 object-cover rounded-xl shadow-lg'
                    />
                </div>

                {/* Contenu de l'article */}
                <article className='prose prose-lg prose-gray max-w-none'>
                    <div
                        className='leading-relaxed'
                        dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
                    />
                </article>

                {/* Footer de l'article */}
                <footer className='mt-16 pt-8 border-t border-gray-200'>
                    <div className='text-center'>
                        <a
                            href='/blog'
                            className='inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium'
                        >
                            ← Retour au blog
                        </a>
                    </div>
                </footer>
            </main>
        </>
    );
}
