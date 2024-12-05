import { useTranslation } from 'react-i18next';
import { Navigation } from '~/components/Navigation';
import { GameGrid } from '~/components/GameGrid';
import { supabase } from '~/lib/supabase.server';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Game } from '~/types';

export const loader: LoaderFunction = async () => {
  // Fetch popular games
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'active')
    .order('plays', { ascending: false })
    .order('likes', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error('Failed to fetch popular games');
  }

  return json({ games: games || [] });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Popular Games - Casual Games" },
    { name: "description", content: "Play our most popular casual games!" },
  ];
};

export default function PopularGames() {
  const { t } = useTranslation();
  const { games } = useLoaderData<{ games: Game[] }>();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          {t('common.popularGames')}
        </h1>

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
