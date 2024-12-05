import { useTranslation } from 'react-i18next';
import { Navigation } from '~/components/Navigation';
import { GameCategory } from '~/components/GameCategory';
import { supabase } from '~/lib/supabase.server';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Game } from '~/types';

export const loader: LoaderFunction = async () => {
  // Fetch all active games
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'active')
    .order('title', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch games');
  }

  return json({ games: games || [] });
};

export default function AllGames() {
  const { t } = useTranslation();
  const { games } = useLoaderData<{ games: Game[] }>();

  // Group games by category
  const gamesByCategory = games.reduce((acc: { [key: string]: Game[] }, game) => {
    if (!acc[game.category]) {
      acc[game.category] = [];
    }
    acc[game.category].push(game);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          {t('common.allGames')}
        </h1>

        {Object.entries(gamesByCategory).map(([category, games]) => (
          <GameCategory
            key={category}
            category={category}
            games={games}
          />
        ))}

        {games.length === 0 && (
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
