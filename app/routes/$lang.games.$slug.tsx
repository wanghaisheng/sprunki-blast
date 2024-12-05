import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import type { Game } from '~/types';
import { supabase } from '~/lib/supabase.server';
import { GameDetail } from '~/components/GameDetail';
import { Navigation } from '~/components/Navigation';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.game) {
    return [
      { title: 'Game Not Found' },
      { description: 'The requested game could not be found.' }
    ];
  }

  const { game } = data;
  return [
    { title: `${game.title} - Casual Game Studio` },
    { description: game.description },
    { 'og:title': game.title },
    { 'og:description': game.description },
    { 'og:image': game.thumbnail_url },
    { 'og:type': 'website' },
    { 'twitter:card': 'summary_large_image' },
    { 'twitter:title': game.title },
    { 'twitter:description': game.description },
    { 'twitter:image': game.thumbnail_url },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single();

  if (error || !game) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ game });
}

export default function GameDetailPage() {
  const { game } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <GameDetail game={game} />
      </main>
    </div>
  );
}
