import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch { /* Storage is optional. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Storage is optional. */ }
  }, [theme]);

  const toggleTheme = () => setTheme(value => value === 'light' ? 'dark' : 'light');
  return { theme, toggleTheme };
}
