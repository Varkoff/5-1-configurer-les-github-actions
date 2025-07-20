import { useLoaderData } from 'react-router';
import { ArticleCard } from '~/components/ArticleCard';
import { MetaTags } from '~/components/MetaTags';
import { fetchArticles } from '~/server/articles.server';

export const loader = async () => {
    return await fetchArticles()
}

export default function Home() {
    const articles = useLoaderData<typeof loader>()
    return (
        <>
            <MetaTags
                title='Le blog tech de Virgile'
                description='Développeur ReactJS passionné, je partage du contenu sur Remix, TailwindCSS et ReactJS'
            />
            <main className='max-w-4xl mx-auto px-6 py-12'>
                <div className='mb-12'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>Le blog tech de Virgile</h1>
                    <p className='text-lg text-gray-600'>Découvrez mes derniers articles sur Remix, TailwindCSS et ReactJS</p>
                </div>

                <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </main>
        </>
    );
}
