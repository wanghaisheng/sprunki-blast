import { useTranslation } from 'react-i18next';
import { GameGrid } from './GameGrid';
import type { Game } from '~/types';

interface GameCategoryProps {
  category: string;
  games: Game[];
}

export function GameCategory({ category, games }: GameCategoryProps) {
  const { t } = useTranslation();

  return (
    <section className="mb-12 last:mb-0">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t(`categories.${category}`)}
      </h2>
      <GameGrid games={games} />
    </section>
  );
}
