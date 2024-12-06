import { SimpleGameCard } from './SimpleGameCard';
import type { Game } from '~/types';

interface SimpleGameGridProps {
  games: Game[];
}

export function SimpleGameGrid({ games }: SimpleGameGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <SimpleGameCard
          key={game.id}
          slug={game.slug}
          thumbnailUrl={game.thumbnail_url}
        />
      ))}
    </div>
  );
}
