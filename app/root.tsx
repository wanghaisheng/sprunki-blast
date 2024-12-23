import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useLocation,
  Link,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import i18n from "./i18n/config";
import "./tailwind.css";
import { useTranslation } from "react-i18next";
import { Footer } from "./components/Footer";

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Check if there's a language prefix
  const langMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  if (langMatch) {
    const lang = langMatch[1];
    // If it's English, redirect to the same path without the language prefix
    if (lang === 'en') {
      const newPath = pathname.replace(/^\/en(\/|$)/, '/');
      return redirect(newPath || '/');
    }
  }

  return null;
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { t } = useTranslation();
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${location.pathname}`;
  const shareText = t('common.share');

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <html lang={i18n.language} className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>
          {`
            :root {
              color-scheme: dark;
            }
            body {
              font-family: 'Poppins', sans-serif;
              background: linear-gradient(to bottom right, rgb(17, 24, 39), rgb(31, 41, 55));
              min-height: 100vh;
              color: rgb(209, 213, 219);
            }
            h1, h2, h3, h4, h5, h6 {
              letter-spacing: -0.02em;
              color: rgb(243, 244, 246);
            }
            ::selection {
              background-color: rgb(59, 130, 246, 0.2);
            }
            ::-webkit-scrollbar {
              width: 10px;
            }
            ::-webkit-scrollbar-track {
              background: rgb(17, 24, 39);
            }
            ::-webkit-scrollbar-thumb {
              background: rgb(55, 65, 81);
              border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: rgb(75, 85, 99);
            }
          `}
        </style>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XZCSF5EH1D"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XZCSF5EH1D');
            `,
          }}
        />
      </head>
      <body className="antialiased bg-gray-900 flex flex-col min-h-screen">
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}