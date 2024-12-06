import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

interface SimpleGameCardProps {
  slug: string;
  thumbnailUrl: string;
  hasPlayed?: boolean;
}

export function SimpleGameCard({ slug, thumbnailUrl, hasPlayed = false }: SimpleGameCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/games/${slug}`}
      className="group relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
    >
      <img
        src={thumbnailUrl}
        alt=""
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      {hasPlayed && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/50">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 13.5L19.5 10.5M19.5 10.5L19.5 7.5M19.5 10.5L16.5 10.5M19.5 10.5L22.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12.2422 20.619C13.1987 21.1966 14.4768 20.4529 14.4768 19.3457V15.8023C14.4768 15.3604 14.2441 14.9514 13.8639 14.7223L9.87654 12.3366C8.92004 11.7589 7.64196 12.5026 7.64196 13.6098V17.1532C7.64196 17.5951 7.87465 18.0041 8.25484 18.2332L12.2422 20.619Z" fill="currentColor"/>
                <path d="M12.2422 11.619C13.1987 12.1966 14.4768 11.4529 14.4768 10.3457V6.80231C14.4768 6.36037 14.2441 5.95138 13.8639 5.72229L9.87654 3.33664C8.92004 2.75894 7.64196 3.50261 7.64196 4.60984V8.15321C7.64196 8.59516 7.87465 9.00415 8.25484 9.23324L12.2422 11.619Z" fill="currentColor"/>
              </svg>
              {hasPlayed ? t('common.playAgain') : t('common.playNow')}
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
