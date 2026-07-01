import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: [
      `${siteConfig.baseUrl}/sitemap.xml/static`,
      `${siteConfig.baseUrl}/sitemap.xml/geo`,
      `${siteConfig.baseUrl}/sitemap.xml/pillar`,
      `${siteConfig.baseUrl}/sitemap.xml/cantieri`,
    ],
    host: siteConfig.baseUrl,
  };
}
