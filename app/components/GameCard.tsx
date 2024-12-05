import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import type { Game } from '~/types';

interface GameCardProps extends Partial<Game> {}

export function GameCard({ 
  id, 
  title, 
  slug,
  thumbnail_url, 
  category,
  likes,
  dislikes,
  plays,
  rating,
  is_featured,
  is_new
}: GameCardProps) {
  const { t, i18n } = useTranslation();

  const getLocalizedPath = (path: string) => {
    return i18n.language === 'en' ? path : `/${i18n.language}${path}`;
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
      <Link to={getLocalizedPath(`/games/${slug}`)} className="block h-full">
        <div className="flex h-full flex-col">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={thumbnail_url || 'https://placehold.co/600x400'}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute left-3 right-3 top-3 flex flex-wrap gap-2">
              {is_new && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-green-500/30 backdrop-blur-sm transition-transform hover:scale-105 dark:shadow-green-900/30">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM12 2.75C14.0836 2.75 16.0044 3.46939 17.5611 4.71846L18.4389 3.53154C16.6344 2.09561 14.4164 1.25 12 1.25V2.75ZM20.4253 11.469C20.7331 11.6345 20.7331 12.3655 20.4253 12.531L21.7092 13.3068C22.6297 12.7322 22.6297 11.2678 21.7092 10.6932L20.4253 11.469ZM17.5611 4.71846L11.7553 2.29085L12.5311 3.57468L18.4389 3.53154L17.5611 4.71846ZM11.7553 2.29085C10.8348 1.71622 9.75 2.37683 9.75 3.42705H11.25C11.25 3.39722 11.2728 3.37323 11.3036 3.36061C11.3344 3.34799 11.3709 3.34899 11.4009 3.36327C11.4309 3.37754 11.4516 3.40356 11.4573 3.43408C11.463 3.4646 11.4532 3.49593 11.4311 3.51846L11.7553 2.29085Z" fill="currentColor"/>
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t('common.new')}
                </span>
              )}
              {is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-purple-500/30 backdrop-blur-sm transition-transform hover:scale-105 dark:shadow-purple-900/30">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64193 8.82547 5.99623L9.15316 5.40838Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {t('common.featured')}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {title}
              </h3>
              {category && (
                <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {category}
                </span>
              )}
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M14 8H16M16 8H18M16 8V6M16 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 13H9M9 13H11M9 13V11M9 13V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {plays && plays.toLocaleString()}
                </span>
                {((likes && likes > 0) || (dislikes && dislikes > 0)) && (
                  <span className="flex items-center gap-1.5">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {likes}
                  </span>
                )}
              </div>
              {rating && rating > 0 && (
                <span className="flex items-center gap-1.5 rounded-lg bg-yellow-100 px-2.5 py-1 dark:bg-yellow-900/30">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                  </svg>
                  <span className="font-medium text-yellow-800 dark:text-yellow-100">{rating.toFixed(1)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}