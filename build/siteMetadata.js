export default function siteMetadata(origin) {
  return {
      name: 'portfolio-metadata',
      transformIndexHtml() {
        if (!origin) return [];
        return [
          { tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${origin}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: `${origin}/icons/web-app-manifest-512x512.png` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Aadish Rathore portfolio icon' }, injectTo: 'head' },
        ];
      },
      generateBundle() {
        if (!origin) return;
        const urls = ['/', '/projects', '/frontend'].map(path => `<url><loc>${origin}${path}</loc></url>`).join('');
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>` });
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` });
      },
    };
}
