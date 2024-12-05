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
    <header className="sticky top-0 z-50 bg-white/80 shadow backdrop-blur-sm transition-colors dark:bg-gray-800/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link 
            to={getLocalizedPath('/')} 
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            {t('common.title')}
          </Link>
          
          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={getLocalizedPath(item.path)}
                  className={`text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  );
}