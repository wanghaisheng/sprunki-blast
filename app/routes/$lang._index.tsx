import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, redirect } from '@remix-run/react';
import { GameGrid } from '~/components/GameGrid';
import { Navigation } from '~/components/Navigation';
import { supabase } from '~/lib/supabase.server';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Game } from '~/types';

export const loader: LoaderFunction = async ({ params }) => {
  // Validate language parameter
  const validLanguages = ['en', 'zh', 'es', 'hi', 'ar', 'pt', 'bn', 'ru', 'ja', 'fr'];
  if (!params.lang) {
    return redirect('/');
  }
  const lang = params.lang;
  if (!validLanguages.includes(lang)) {
    return redirect('/');
  }

  // If it's English, redirect to default route
  if (lang === 'en') {
    return redirect('/');
  }

  // Fetch featured and new games with language filter
  const [featuredGamesResponse, newGamesResponse] = await Promise.all([
    supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .eq('audience_language', lang)
      .order('plays', { ascending: false })
      .limit(8),
    supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .eq('is_new', true)
      .eq('audience_language', lang)
      .order('release_date', { ascending: false })
      .limit(6)
  ]);

  if (featuredGamesResponse.error) {
    throw new Error('Failed to fetch featured games');
  }

  if (newGamesResponse.error) {
    throw new Error('Failed to fetch new games');
  }

  // If no games found for the language, redirect to default route
  // if (featuredGamesResponse.data.length === 0 && newGamesResponse.data.length === 0) {
  //   return redirect('/');
  // }

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

export default function LanguageIndex() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const { featuredGames, newGames } = useLoaderData<{
    featuredGames: Game[];
    newGames: Game[];
  }>();

  // Update language based on URL parameter
  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {featuredGames.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              {t('common.featuredGames')}
            </h2>
            <GameGrid games={featuredGames} />
          </section>
        )}

        {newGames.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              {t('common.newGames')}
            </h2>
            <GameGrid games={newGames} />
          </section>
        )}

        {featuredGames.length === 0 && newGames.length === 0 && (
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
