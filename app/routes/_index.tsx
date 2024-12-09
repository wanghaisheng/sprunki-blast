import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameGrid } from '~/components/GameGrid';
import { Navigation } from '~/components/Navigation';
import { RecentPlayedGames } from '~/components/RecentPlayedGames';
import { supabase } from '~/lib/supabase.server';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Game } from '~/types';
import { getGameHistory } from '~/utils/gameHistory.server';
import { Hero } from "~/components/Hero";

export async function loader({ request }: LoaderFunctionArgs) {
  // Fetch recent games from cookie
  const recentGames = await getGameHistory(request);

  // Fetch featured and new games
  const [featuredGamesResponse, newGamesResponse] = await Promise.all([
    supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .eq('audience_language', 'en')
      .order('plays', { ascending: false })
      .limit(8),
    supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .eq('is_new', true)
      .eq('audience_language', 'en')
      .order('release_date', { ascending: false })
      .limit(8)
  ]);

  if (featuredGamesResponse.error) {
    throw new Error('Failed to fetch featured games');
  }

  if (newGamesResponse.error) {
    throw new Error('Failed to fetch new games');
  }

  return json({
    recentGames,
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
  const { featuredGames, newGames, recentGames } = useLoaderData<typeof loader>();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <Hero />
        
        {/* Recent Games */}
        <RecentPlayedGames games={recentGames} />

        {/* Featured Games */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            {t('common.featuredGames')}
          </h2>
          <GameGrid games={featuredGames} />
        </section>

        {/* New Games */}
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