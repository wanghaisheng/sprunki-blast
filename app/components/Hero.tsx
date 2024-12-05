import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { ImageCarousel } from "./ImageCarousel";

export function Hero() {
  const { t, i18n } = useTranslation();

  // Featured game images from Unsplash
  const featuredImages = [
    {
      src: "https://futurelog-1251943639.cos.accelerate.myqcloud.com/img/202412052034537.jpg",
      alt: "Gaming Setup with RGB Lighting",
    },
    {
      src: "https://futurelog-1251943639.cos.accelerate.myqcloud.com/img/202412052037866.png",
      alt: "Retro Gaming Console",
    },
    {
      src: "https://futurelog-1251943639.cos.accelerate.myqcloud.com/img/202412052114236.jpeg",
      alt: "Gaming Controller in Neon Light",
    },
  ];

  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_top_left,theme(colors.purple.600),transparent_50%),radial-gradient(circle_at_bottom_right,theme(colors.blue.600),transparent_50%),radial-gradient(circle_at_center,theme(colors.indigo.600),theme(colors.indigo.800))] shadow-xl">
      {/* Background pattern */}
      {/* <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(white_2px,transparent_2px),linear-gradient(90deg,white_2px,transparent_2px)] bg-[size:40px_40px]" /> */}

      {/* Content */}
      <div className="relative z-10 grid min-h-[500px] gap-8 md:grid-cols-2">
        {/* Left column - Text content */}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <h1 className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
            {t('common.title')}
          </h1>
          <p className="mt-6 text-lg text-blue-100 sm:text-xl">
            {t('common.description')}
          </p>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link
              to={`/${i18n.language}/new-games`}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-0.5 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              <span className="relative flex items-center gap-2 rounded-full bg-black px-8 py-3 text-lg transition-all duration-300 group-hover:bg-opacity-0">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846L5.25 15l2.937-.813L9 11.25l.813 2.937L12.75 15l-2.937.904z" fill="currentColor"/>
                  <path d="M19.813 8.904L19 11.75l-.813-2.846L15.25 8l2.937-.813L19 4.25l.813 2.937L22.75 8l-2.937.904z" fill="currentColor"/>
                  <path d="M4.813 8.904L4 11.75l-.813-2.846L.25 8l2.937-.813L4 4.25l.813 2.937L7.75 8l-2.937.904z" fill="currentColor"/>
                </svg>
                {t('common.newGames')}
              </span>
            </Link>
            <Link
              to={`/${i18n.language}/popular-games`}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-0.5 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
            >
              <span className="relative flex items-center gap-2 rounded-full bg-black px-8 py-3 text-lg transition-all duration-300 group-hover:bg-opacity-0">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 23C7.029 23 3 18.971 3 14C3 10.867 4.333 7.733 7 5.333C9.667 2.933 12 2 12 2C12 2 14.333 2.933 17 5.333C19.667 7.733 21 10.867 21 14C21 18.971 16.971 23 12 23ZM12 4.6C11.551 4.933 10.733 5.533 9.8 6.4C7.6 8.4 6.5 11.067 6.5 14C6.5 17.033 8.967 19.5 12 19.5C15.033 19.5 17.5 17.033 17.5 14C17.5 11.067 16.4 8.4 14.2 6.4C13.267 5.533 12.449 4.933 12 4.6Z" fill="currentColor"/>
                  <path d="M12 18C10.343 18 9 16.657 9 15C9 13.8 9.8 12.4 11.4 10.8C11.6 10.6 11.8 10.4 12 10.2C12.2 10.4 12.4 10.6 12.6 10.8C14.2 12.4 15 13.8 15 15C15 16.657 13.657 18 12 18Z" fill="currentColor"/>
                </svg>
                {t('common.popularGames')}
              </span>
            </Link>
          </div>
        </div>

        {/* Right column - Image carousel */}
        <div className="relative h-full min-h-[300px] md:min-h-full">
          <ImageCarousel images={featuredImages} />
        </div>
      </div>
    </div>
  );
}
