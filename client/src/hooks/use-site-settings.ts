import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { SiteSetting } from "@shared/schema";

interface UseSiteSettingsReturn {
  settings: SiteSetting[];
  getSettingValue: (key: string, defaultValue?: string) => string;
  isLoading: boolean;
  error: any;
}

export function useSiteSettings(): UseSiteSettingsReturn {
  // Fetch site settings
  const { data: settingsData, isLoading, error } = useQuery<{ success: boolean; settings: SiteSetting[] }>({
    queryKey: ['/api/site-settings'],
    staleTime: 5 * 60 * 1000, // 5 minutes - settings don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const settings: SiteSetting[] = settingsData?.settings || [];

  // Helper function to get setting value by key
  const getSettingValue = (key: string, defaultValue: string = ""): string => {
    const setting = settings.find((s: SiteSetting) => s.key === key);
    return setting?.value || defaultValue;
  };

  // Apply site settings to document when they change
  useEffect(() => {
    if (!isLoading && settings.length > 0) {
      // Update document title
      const siteTitle = getSettingValue('site_title', 'AetherWoW - Servidor Privado WoW Legion');
      if (siteTitle && document.title !== siteTitle) {
        document.title = siteTitle;
      }

      // Update meta description
      const siteDescription = getSettingValue('site_description', 
        'Únete a la aventura épica en AetherWoW, el mejor servidor privado de World of Warcraft Legion con contenido personalizado y una comunidad activa.');
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', siteDescription);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', siteDescription);
        document.head.appendChild(metaDescription);
      }

      // Update Open Graph title
      const ogTitle = getSettingValue('og_title', 'AetherWoW - Servidor Privado WoW Legion');
      let metaOgTitle = document.querySelector('meta[property="og:title"]');
      if (metaOgTitle) {
        metaOgTitle.setAttribute('content', ogTitle);
      } else {
        metaOgTitle = document.createElement('meta');
        metaOgTitle.setAttribute('property', 'og:title');
        metaOgTitle.setAttribute('content', ogTitle);
        document.head.appendChild(metaOgTitle);
      }

      // Update Open Graph description
      const ogDescription = getSettingValue('og_description', 
        'La mejor experiencia de World of Warcraft Legion con contenido personalizado y comunidad activa');
      let metaOgDescription = document.querySelector('meta[property="og:description"]');
      if (metaOgDescription) {
        metaOgDescription.setAttribute('content', ogDescription);
      } else {
        metaOgDescription = document.createElement('meta');
        metaOgDescription.setAttribute('property', 'og:description');
        metaOgDescription.setAttribute('content', ogDescription);
        document.head.appendChild(metaOgDescription);
      }

      // Update favicon
      const faviconUrl = getSettingValue('site_favicon', '/favicon.ico');
      if (faviconUrl) {
        let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        if (favicon.href !== faviconUrl) {
          favicon.href = faviconUrl;
        }

        // Also update shortcut icon if it exists
        let shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
        if (!shortcutIcon) {
          shortcutIcon = document.createElement('link');
          shortcutIcon.rel = 'shortcut icon';
          document.head.appendChild(shortcutIcon);
        }
        if (shortcutIcon.href !== faviconUrl) {
          shortcutIcon.href = faviconUrl;
        }
      }
    }
  }, [settings, isLoading]);

  return {
    settings,
    getSettingValue,
    isLoading,
    error,
  };
}