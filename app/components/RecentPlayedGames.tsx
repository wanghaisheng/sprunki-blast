import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

interface RecentGame {
  slug: string;
  thumbnailUrl: string;
  timestamp: number;
}

interface RecentPlayedGamesProps {
  games: RecentGame[];
}

export function RecentPlayedGames({ games }: RecentPlayedGamesProps) {
  const { t } = useTranslation();

  if (games.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {t('common.recentGames')}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {games.map((game) => (
            <Link
              key={game.slug}
              to={`/games/${game.slug}`}
              className="group relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={game.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
