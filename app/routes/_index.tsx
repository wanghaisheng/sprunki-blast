import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameGrid } from '~/components/GameGrid';
import { Navigation } from '~/components/Navigation';
import { supabase } from '~/lib/supabase.server';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Game } from '~/types';

export const loader: LoaderFunction = async () => {
  // Fetch featured and new games
  const [featuredGamesResponse, newGamesResponse] = await Promise.all([
    supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('plays', { ascending: false })
      .limit(8),
    supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .eq('is_new', true)
      .order('release_date', { ascending: false })
      .limit(6)
  ]);

  if (featuredGamesResponse.error) {
    throw new Error('Failed to fetch featured games');
  }

  if (newGamesResponse.error) {
    throw new Error('Failed to fetch new games');
  }

  return json({
    featuredGames: featuredGamesResponse.data,
    newGames: newGamesResponse.data,
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Casual Games" },
    { name: "description", content: "Play awesome casual games!" },
  ];
};

export default function Index() {
  const { t, i18n } = useTranslation();
  const { featuredGames, newGames } = useLoaderData<{
    featuredGames: Game[];
    newGames: Game[];
  }>();

  // Set English as the default language
  useEffect(() => {
    if (i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            {t('common.featuredGames')}
          </h2>
          <GameGrid games={featuredGames} />
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            {t('common.newGames')}
          </h2>
          <GameGrid games={newGames} />
        </section>
      </main>
    </div>
  );
}