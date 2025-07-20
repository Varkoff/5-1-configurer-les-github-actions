import { href, Link } from 'react-router';
import type { Article } from '~/server/articles.server';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
    return (
        <article className='relative group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300'>
            <div className='aspect-video overflow-hidden'>
                <img
                    src={article.image}
                    alt={article.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
            </div>

            <div className='p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                    {article.title}
                </h2>

                <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                    {article.description}
                </p>

                <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-500 uppercase tracking-wide font-medium'>
                        Article #{article.id}
                    </span>
                    <button className='text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors'>
                        Lire la suite →
                    </button>
                </div>
            </div>
            <Link to={href("/blog/:slug", {
                slug: article.slug
            })} className='absolute inset-0 z-10'></Link>
        </article>
    );
}; 