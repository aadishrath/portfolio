import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import siteMetadata from './build/siteMetadata.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const configured = env.VITE_SITE_URL?.trim();
  let origin;
  if (configured) {
    const url = new URL(configured);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('VITE_SITE_URL must be a public HTTP(S) origin without a path.');
    origin = url.origin;
  }
  return {
    plugins: [react(), siteMetadata(origin)],
    server: { port: 5173 },
  };
});
