import { de } from "~/i18n/locales/de"
import Game from "~/types"


const game_info_en: Game = {
    // keep the same, don't translate
    title: "Sprunki Incredibox",
    slug: "sprunki-incredibox",  // add language code suffix
    thumbnail_url: "",
    screenshots: [
        "",
        ""
    ],
    gameplay_videos: [
        "x72yVyvOS1Y"
    ],
    iframe_url: "https://scratch.mit.edu/projects/1090434936/embed",
    game_language: "en",  // repalce with the translated target language code
    source_url: "https://scratch.mit.edu/",
    release_date: "2024-10-11",
    uploader_id: "d7886949-05ad-459a-9599-747ef6d19a1f",
    is_featured: true,  // keep the same in other languages
    is_new: true,  // keep the same in other languages

    // replace the following with random numbers
    plays: 118762,  // replace with random number between 100000 and 200000
    likes: 25892,  // replace with random number between 10000 and 50000
    dislikes: 2204,  // replace with random number between 100 and 2000
    shares: 0, 
    rating: 4.8,  // replace with random number between 3.5 and 4.9

    // replace with the translated target language code
    audience_language: "en",

    // should be translated
    category: "music",  // should be translated, but get from app/i18n/locales
    tags: ["music", "scratch", "mobile", "2D", ],  // should be translated
    description: "",
    instructions: "",  // shoule be translated
}

// Prompt: translate the game_info_en object to the other languages one by one: 'en', 'zh', 'es', 'hi', 'ar', 'pt', 'bn', 'ru', 'ja', 'fr', 'de', 'ko', 'it', 'tr', 'id', 'nl', 'el', 'th', 'sv'
// for example: the translated game_info_en object to zh is as following:
// """
// const game_info_zh: Game = {
//     title: "Sprunki Incredibox",
//     slug: "sprunki-incredibox",
//     thumbnail_url: "",
//     screenshots: [
//         "",
//         ""
//     ],
//     gameplay_videos: [
//         "x72yVyvOS1Y"
//     ],
//     iframe_url: "https://scratch.mit.edu/projects/1090434936/embed",
//     game_language: "en",
//     source_url: "https://scratch.mit.edu/",
//     release_date: "2024-10-11",
//     uploader_id: "d7886949-05ad-459a-9599-747ef6d19a1f",
//     is_featured: true,
//     is_new: true,
//     plays: 118762,
//     likes: 25892,
//     dislikes: 2204,
//     shares: 0,
//     rating: 4.8,
//     audience_language: "zh",
//     category: "音乐", 
//     tags: ["", ""],
//     description: "",
//     instructions: "",
// }
// """
// after translated, generate sql for inserting game info to supabse table.
