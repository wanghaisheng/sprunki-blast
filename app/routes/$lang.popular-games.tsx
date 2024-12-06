import { useTranslation } from 'react-i18next';
import { useParams } from '@remix-run/react';
import { useEffect } from 'react';
import { Navigation } from '~/components/Navigation';
import { GameGrid } from '~/components/GameGrid';
import { supabase } from '~/lib/supabase.server';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Game } from '~/types';

export const loader: LoaderFunction = async ({ params }) => {
  // Validate language parameter
  const validLanguages = ['en', 'zh', 'es', 'hi', 'ar', 'pt', 'bn', 'ru', 'ja', 'fr', 'de', 'ko', 'it', 'tr', 'id', 'nl', 'el', 'th', 'sv'];
  const language = params.lang ?? 'en';
  if (!validLanguages.includes(language)) {
    return redirect('/en/popular-games');
  }

  // Fetch popular games for the current language
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'active')
    .eq('audience_language', language)
    .order('plays', { ascending: false })
    .order('likes', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error('Failed to fetch popular games');
  }

  return json({ games: games || [] });
};

export const meta: MetaFunction = () => {
  const { t } = useTranslation();
  return [
    {
      title: `${t('common.popular')} - ${t('common.title')}`,
      description: `${t('common.description')}`,
    }
  ];
};

export default function PopularGames() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const { games } = useLoaderData<{ games: Game[] }>();

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
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            {t('common.popularGames')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('common.popularGamesDescription')}
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
