import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { Game } from '~/types';
import { useLocation } from '@remix-run/react';
import { YouTubeVideo } from './YouTubeVideo';
import { useState, useEffect } from 'react';
import { getSupabaseClient } from '~/lib/supabase.client';

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

  const shareLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0 5.628 3.874 10.35 9.101 11.647Z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
    {
      name: 'Discord',
      url: `https://discord.com/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
    },
    {
      name: 'Line',
      url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: `https://www.instagram.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
        </svg>
      ),
    }
  ];

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
          <div className="mb-8 py-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {t('gameDetail.details')}
            </h2>
            <dl className="space-y-2 px-4 mb-4">
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
