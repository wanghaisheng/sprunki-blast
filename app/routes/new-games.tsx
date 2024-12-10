import { useTranslation } from 'react-i18next';
import { Navigation } from '~/components/Navigation';
import { GameGrid } from '~/components/GameGrid';
import { supabase } from '~/lib/supabase.server';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Game } from '~/types';

export const loader: LoaderFunction = async () => {
  // Fetch new games
  const { data: games, error } = await supabase
    .from('games') 
    .select('*')
    .eq('status', 'active')
    .eq('is_new', true)
    .eq('audience_language', 'en')
    .order('release_date', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error('Failed to fetch new games');
  }

  return json({ games: games || [] });
};

export const meta: MetaFunction = () => {
  const { t } = useTranslation();
  return [
    { title: t('common.newGames') + ' - ' + t('common.title') },
    { name: 'description', content: t('common.description') },
    { name: 'keywords', content: t('common.keywords') },
    { 'og:title': t('common.newGames') + ' - ' + t('common.title') },
    { 'og:description': t('common.description') },
    { 'og:image': "./logo.png" },
    { 'og:url': 'https://hypercasualgames.online' },
    { 'og:type': 'website' },
    { 'twitter:card': 'summary_large_image' },
    { 'twitter:title': t('common.newGames') + ' - ' + t('common.title') },
    { 'twitter:description': t('common.description') },
    { 'twitter:image': "./logo.png" },
    { 'twitter:url': 'https://hypercasualgames.online' },
  ];
};

export default function NewGames() {
  const { t } = useTranslation();
  const { games } = useLoaderData<{ games: Game[] }>();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            {t('common.newGames')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('common.newGamesDescription')}
          </p>
        </div>

        {games.length > 0 ? (
          <GameGrid games={games} />
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">
              {t('common.noGames')}
            </h2>
          </div>
        )}
      </main>
    </div>
  );
}
