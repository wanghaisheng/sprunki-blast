import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import type { Game } from '~/types';
import { supabase } from '~/lib/supabase.server';
import { GameDetail } from '~/components/GameDetail';
import { Navigation } from '~/components/Navigation';
import { getGameHistory, addGameToHistory, gameHistoryCookie } from '~/utils/gameHistory.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.game) {
    return [
      { title: 'Game Not Found' },
      { description: 'The requested game could not be found.' }
    ];
  }

  const { game } = data;
  return [
    { title: `${game.title} - Hyper Casual Games Online` },
    { description: game.description },
    { keywords: game.tags.join(', ') },
    { 'og:title': game.title },
    { 'og:description': game.description },
    { 'og:image': game.thumbnail_url },
    { 'og:type': 'website' },
    { 'og:url': `https://hypercasualgames.online/game/${game.slug}` },
    { 'twitter:card': 'summary_large_image' },
    { 'twitter:title': game.title },
    { 'twitter:description': game.description },
    { 'twitter:image': game.thumbnail_url },
    { 'twitter:url': `https://hypercasualgames.online/game/${game.slug}` },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single();

  if (error || !game) {
    throw new Response('Not Found', { status: 404 });
  }

  // Update game history cookie
  const history = await getGameHistory(request);
  const newHistory = await addGameToHistory(history, game.slug, game.thumbnail_url);
  
  return json(
    { 
      game,
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      },
    },
    {
      headers: {
        'Set-Cookie': await gameHistoryCookie.serialize(newHistory),
      },
    }
  );
}

export default function GameDetailPage() {
  const { game, env } = useLoaderData<{ game: Game; env: { SUPABASE_URL: string; SUPABASE_ANON_KEY: string } }>();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <GameDetail 
          game={game} 
          t={t} 
          supabaseUrl={env.SUPABASE_URL} 
          supabaseAnonKey={env.SUPABASE_ANON_KEY}
        />
      </main>
    </div>
  );
}
