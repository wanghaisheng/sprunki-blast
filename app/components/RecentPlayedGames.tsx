import { useTranslation } from 'react-i18next';
import { SimpleGameCard } from './SimpleGameCard';

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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {games.map((game) => (
            <SimpleGameCard
              key={game.slug}
              slug={game.slug}
              thumbnailUrl={game.thumbnailUrl}
              hasPlayed={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
