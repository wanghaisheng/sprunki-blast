import { createCookie } from '@remix-run/node';

interface GameHistoryItem {
  slug: string;
  thumbnailUrl: string;
  timestamp: number;
}

const COOKIE_NAME = 'game_history';
const MAX_HISTORY_ITEMS = 10;

export const gameHistoryCookie = createCookie(COOKIE_NAME, {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

export async function getGameHistory(request: Request): Promise<GameHistoryItem[]> {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = await gameHistoryCookie.parse(cookieHeader);
  return Array.isArray(cookie) ? cookie : [];
}

export async function addGameToHistory(
  history: GameHistoryItem[],
  slug: string,
  thumbnailUrl: string
): Promise<GameHistoryItem[]> {
  const now = Date.now();
  const newHistory = history.filter((item) => item.slug !== slug);
  
  newHistory.unshift({
    slug,
    thumbnailUrl,
    timestamp: now,
  });

  return newHistory.slice(0, MAX_HISTORY_ITEMS);
}
