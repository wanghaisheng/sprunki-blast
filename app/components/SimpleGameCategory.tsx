import { useTranslation } from 'react-i18next';
import { SimpleGameGrid } from './SimpleGameGrid';
import type { Game } from '~/types';

interface SimpleGameCategoryProps {
  category: string;
  games: Game[];
}

export function SimpleGameCategory({ category, games }: SimpleGameCategoryProps) {
  const { t } = useTranslation();

  return (
    <section className="mb-12 last:mb-0">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t(`categories.${category}`)}
      </h2>
      <SimpleGameGrid games={games} />
    </section>
  );
}
