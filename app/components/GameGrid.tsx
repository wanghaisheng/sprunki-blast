import { GameCard } from './GameCard';
import type { Game } from '~/types';

interface GameGridProps {
  games: Game[];
}

export function GameGrid({ games }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          title={game.title}
          slug={game.slug}
          thumbnail_url={game.thumbnail_url}
          category={game.category}
          likes={game.likes}
          dislikes={game.dislikes}
          plays={game.plays}
          rating={game.rating}
          is_featured={game.is_featured}
          is_new={game.is_new}
        />
      ))}
    </div>
  );
}