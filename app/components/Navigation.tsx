import { useTranslation } from 'react-i18next';
import { Link, useLocation } from '@remix-run/react';
import { LanguageSelector } from './LanguageSelector';

export function Navigation() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const getLocalizedPath = (path: string) => {
    return i18n.language === 'en' ? path : `/${i18n.language}${path}`;
  };

  const navItems = [
    { key: 'new', path: '/new-games', label: t('common.newGames') },
    { key: 'popular', path: '/popular-games', label: t('common.popularGames') },
    { key: 'all', path: '/all-games', label: t('common.allGames') },
  ];

  const isActivePath = (path: string) => {
    const currentPath = location.pathname.replace(/^\/[a-z]{2}\//, '/');
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/95 to-gray-800/95 shadow-lg backdrop-blur-sm transition-all duration-300 border-b border-gray-700/50">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link 
            to={getLocalizedPath('/')} 
            className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 ease-out"
          >
            {t('common.title')}
          </Link>
          
          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={getLocalizedPath(item.path)}
                  className={`relative px-4 py-2 text-sm font-bold tracking-wide transition-all duration-200 hover:scale-105 ${
                    isActivePath(item.path)
                      ? 'text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-400 after:rounded-full after:animate-pulse'
                      : 'text-gray-400 hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pl-2 border-l border-gray-700">
              <LanguageSelector />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}