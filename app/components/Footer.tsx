import { Link } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createSocialLinks, type SocialLink } from "~/utils/socialLinks";

export function Footer() {
  const location = useLocation();
  const { t } = useTranslation();
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${location.pathname}`;
  const shareText = t('common.share');
  const socialLinks = createSocialLinks({ shareUrl, shareText });

  return (
    <footer className="w-full py-6 px-4 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} <Link to="https://hypercgstudio.com" className="hover:underline">HyperCG Studio</Link>. All rights reserved.
        </div>
        <div className="flex gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
