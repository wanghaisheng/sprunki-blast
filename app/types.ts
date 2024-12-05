export interface Game {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  screenshots: string[];
  instructions: string;
  gameplay_videos: string[];
  iframe_url: string;
  category: string;
  tags: string[];
  audience_language: string;
  game_language: string;
  source_url: string;
  release_date: string;
  uploader_id: string;
  plays: number;
  likes: number;
  dislikes: number;
  shares: number;
  rating: number;
  status: string;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export type GamesByCategory = {
  [key: string]: Game[];
}
