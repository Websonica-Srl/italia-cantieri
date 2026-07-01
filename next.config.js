/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'obcxbjxyznbzvgxwptvi.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const redirects = [];

    // Force www redirect: naked domain italiacantieri.it → www.italiacantieri.it
    if (siteUrl) {
      try {
        const url = new URL(siteUrl);
        if (url.hostname.startsWith('www.')) {
          const nakedDomain = url.hostname.replace('www.', '');
          redirects.push({
            source: '/:path*',
            has: [{ type: 'host', value: nakedDomain }],
            destination: `${siteUrl}/:path*`,
            permanent: true,
          });
        }
      } catch {}
    }

    // Percorso gerarchico /:regione/:provincia/:comune → pagina Comune reale
    // (la gerarchia si ferma alla provincia, quindi il 3° livello altrimenti 404).
    // Escludo i prefissi riservati e le dir top-level per non intercettare API/route reali.
    redirects.push({
      source:
        '/:regione((?!api|api-pubbliche|bandi|bando|cantiere|cantieri|chi-siamo|come-trattiamo-i-dati|comune|contatti|esplora|glossario|guide|iscriviti|lavori|legal|per-pubbliche-amministrazioni|regioni|statistiche|_next)[^/]+)/:provincia/:comune',
      destination: '/comune/:comune',
      permanent: false,
    });

    return redirects;
  },
};

module.exports = nextConfig;
