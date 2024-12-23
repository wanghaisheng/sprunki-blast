import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { Game } from '~/types';
import { useLocation } from '@remix-run/react';
import { YouTubeVideo } from './YouTubeVideo';
import { useState, useEffect } from 'react';
import { getSupabaseClient } from '~/lib/supabase.client';
import { createSocialLinks } from '~/utils/socialLinks';

interface GameDetailProps {
  game: Game;
  t: TFunction;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function GameDetail({ game, t, supabaseUrl, supabaseAnonKey }: GameDetailProps) {
  const location = useLocation();
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${location.pathname}`;
  const shareText = `${t('playNow')}: ${game.title}`;
  const shareLinks = createSocialLinks({ shareUrl, shareText });

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    image: game.thumbnail_url,
    genre: game.category,
    inLanguage: game.audience_language,
    datePublished: game.release_date,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      ratingCount: game.likes + game.dislikes,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isDisliked, setIsDisliked] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(game.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(game.dislikes || 0);
  const [playsCount, setPlaysCount] = useState(game.plays || 0);
  const [sharesCount, setSharesCount] = useState(game.shares || 0);

  // Track plays after 3 seconds
  useEffect(() => {
    const timer = setTimeout(async () => {
      const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from('games')
          .update({ plays: game.plays + 1 })
          .eq('id', game.id);

        if (error) throw error;
        setPlaysCount(prev => prev + 1);
      } catch (error) {
        console.error('Error updating plays count:', error);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [game.id, game.plays, supabaseUrl, supabaseAnonKey]);

  const handleFeedback = async (type: 'like' | 'dislike') => {
    if (isLoading || typeof window === 'undefined') return;
    const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (!supabase) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('games')
        .update({
          [type === 'like' ? 'likes' : 'dislikes']: type === 'like' ? likesCount + 1 : dislikesCount + 1,
        })
        .eq('id', game.id);

      if (error) throw error;

      if (type === 'like') {
        setLikesCount(prev => prev + 1);
      } else {
        setDislikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      // Revert counts on error
      setLikesCount(game.likes || 0);
      setDislikesCount(game.dislikes || 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('games')
        .update({ shares: (game.shares || 0) + 1 })
        .eq('id', game.id);

      if (error) throw error;
      setSharesCount(prev => prev + 1);
    } catch (error) {
      console.error('Error updating shares count:', error);
    }
  };

  // Check existing feedback
  useEffect(() => {
    const checkExistingFeedback = async () => {
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) return;

      const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
      if (!supabase) return;

      const { data } = await supabase
        .from('game_feedback')
        .select('feedback_type')
        .eq('game_id', game.id)
        .eq('session_id', sessionId)
        .single();

      if (data) {
        setIsLiked(data.feedback_type === 'like');
        setIsDisliked(data.feedback_type === 'dislike');
      }
    };

    checkExistingFeedback();
  }, [game.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Game header */}
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          {game.title}
        </h1>
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600 dark:bg-blue-900 dark:text-blue-200">
            {game.category}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 8H16M16 8H18M16 8V6M16 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 13H9M9 13H11M9 13V11M9 13V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {playsCount.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5M19 11C20.1046 11 21 10.1046 21 9V6C21 4.89543 20.1046 4 19 4V4C17.8954 4 17 4.89543 17 6V9C17 10.1046 17.8954 11 19 11Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M17 16L21 12L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {sharesCount.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {likesCount.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {dislikesCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Game iframe */}
      <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <iframe
          src={game.iframe_url}
          className="h-full w-full"
          allowFullScreen 
          title={game.title}
        />
      </div>

      {/* Game content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {t('gameDetail.about')} {game.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{game.description}</p>
          </div>

          {/* Instructions */}
          {game.instructions && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('gameDetail.instructions')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {game.instructions}
              </p>
            </div>
          )}

          {/* Screenshots */}
          {game.screenshots.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('gameDetail.screenshots')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {game.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`${game.title} screenshot ${index + 1}`}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gameplay Videos */}
          {game.gameplay_videos.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('gameDetail.gameplayVideos')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {game.gameplay_videos.map((video, index) => (
                  <YouTubeVideo
                    key={index}
                    url={video}
                    title={`${game.title} gameplay video ${index + 1}`}
                    className="aspect-video w-full rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Feedback buttons */}
          <div className="flex mb-8 items-center space-x-4">
            <button
              onClick={() => handleFeedback('like')}
              disabled={isLoading}
              className="flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900"
            >
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => handleFeedback('dislike')}
              disabled={isLoading}
              className="flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              <span>{dislikesCount}</span>
            </button>
          </div>

          {/* Share section */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {t('gameDetail.share')}
            </h2>
            <div className="flex flex-wrap gap-4">
              {shareLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  title={t('shareOn', { platform: platform.name })}
                  onClick={(e) => {
                    handleShare(platform.name);
                  }}
                >
                  {platform.icon}
                  <span>{platform.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Game details */}
          <div className="mb-8 py-4 rounded-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {t('gameDetail.details')}
            </h2>
            <dl className="space-y-2 mb-4">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  {t('gameDetail.releaseDate')}
                </dt>
                <dd className="text-gray-700 dark:text-gray-300">
                  {new Date(game.release_date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  {t('gameDetail.gameLanguage')}
                </dt>
                <dd className="text-gray-700 dark:text-gray-300">
                  {game.game_language}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  {t('gameDetail.category')}
                </dt>
                <dd className="text-gray-700 dark:text-gray-300">
                  {game.category}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  {t('gameDetail.sourceUrl')}
                </dt>
                <dd className="text-gray-700 dark:text-gray-300">
                  {game.source_url}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  {t('gameDetail.updatedAt')}
                </dt>
                <dd className="text-gray-700 dark:text-gray-300">
                {new Date(game.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Tags */}
          {game.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {t('gameDetail.tags')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
