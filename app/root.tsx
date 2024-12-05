import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import i18n from "./i18n/config";
import "./tailwind.css";

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
    href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={i18n.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>
          {`
            body {
              font-family: 'Outfit', sans-serif;
            }
            h1, h2, h3, h4, h5, h6 {
              letter-spacing: -0.02em;
            }
          `}
        </style>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}