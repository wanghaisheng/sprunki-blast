import { useTranslation } from 'react-i18next';
import { useParams } from '@remix-run/react';
import { useEffect } from 'react';
import { Navigation } from '~/components/Navigation';
import { SimpleGameCategory } from '~/components/SimpleGameCategory';
import { supabase } from '~/lib/supabase.server';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Game } from '~/types';

export const loader: LoaderFunction = async ({ params }) => {
  // Fetch all active games for the current language
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'active')
    .eq('audience_language', params.lang)
    .order('title', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch games');
  }

  return json({ games: games || [] });
};

export const meta: MetaFunction = () => {
  const { t } = useTranslation();
  return [
    { title: t('common.allGames') + ' - ' + t('common.title') },
    { name: 'description', content: t('common.description') },
    { name: 'keywords', content: t('common.keywords') },
    { 'og:title': t('common.allGames') + ' - ' + t('common.title') },
    { 'og:description': t('common.description') },
    { 'og:image': "./logo.png" },
    { 'og:type': 'website' },
    { 'og:url': 'https://hypercasualgames.online' },
    { 'twitter:card': 'summary_large_image' },
    { 'twitter:title': t('common.allGames') + ' - ' + t('common.title') },
    { 'twitter:description': t('common.description') },
    { 'twitter:image': "./logo.png" },
    { 'twitter:url': 'https://hypercasualgames.online' },
  ];
};

export default function AllGames() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const { games } = useLoaderData<{ games: Game[] }>();

  // Update language based on URL parameter
  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Group games by category
  const gamesByCategory = games.reduce((acc: { [key: string]: Game[] }, game) => {
    if (!acc[game.category]) {
      acc[game.category] = [];
    }
    acc[game.category].push(game);
    return acc;
  }, {});

  // Split categories into two columns
  const categories = Object.entries(gamesByCategory);
  const midPoint = Math.ceil(categories.length / 2);
  const leftColumn = categories.slice(0, midPoint);
  const rightColumn = categories.slice(midPoint);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            {t('common.allGames')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('common.allGamesDescription')}
          </p>
        </div>

        {games.length === 0 ? (
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">
              {t('common.noGames')}
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            <div className="space-y-12">
              {leftColumn.map(([category, games]) => (
                <SimpleGameCategory
                  key={category}
                  category={category}
                  games={games}
                />
              ))}
            </div>
            <div className="space-y-12">
              {rightColumn.map(([category, games]) => (
                <SimpleGameCategory
                  key={category}
                  category={category}
                  games={games}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
