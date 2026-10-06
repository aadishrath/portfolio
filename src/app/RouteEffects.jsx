import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_LABELS } from './routes';

export default function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = `${ROUTE_LABELS[pathname] || 'Page not found'} | Aadish Rathore — Frontend Engineer & AI Frontend Engineer`;
    let observer;
    let timer;
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const scroll = () => {
          let id;
          try { id = decodeURIComponent(hash.slice(1)); } catch { return false; }
          const target = document.getElementById(id);
          if (!target) return false;
          target.scrollIntoView();
          observer?.disconnect();
          return true;
        };
        if (!scroll()) {
          observer = new MutationObserver(scroll);
          observer.observe(document.getElementById('root'), { childList: true, subtree: true });
          timer = setTimeout(() => observer.disconnect(), 5000);
        }
      } else {
        window.scrollTo(0, 0);
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }
    });
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); clearTimeout(timer); };
  }, [pathname, hash]);
  return null;
}

