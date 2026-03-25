export const ROUTE_LABELS = {
  '/': 'Home',
  '/projects': 'ML Projects',
  '/frontend': 'Frontend Projects',
  '/sentiment': 'Sentiment Demo',
  '/rag': 'RAG Demo',
};

export function getRouteLabel(pathname) {
  return ROUTE_LABELS[pathname] ?? pathname;
}

export function getQuickPrompts(pathname) {
  const routePrompt = pathname === '/rag'
    ? 'How do I use the RAG demo?'
    : pathname === '/sentiment'
      ? 'How does the sentiment demo work?'
      : 'Tell me about Aadish';

  return [
    routePrompt,
    'What projects should recruiters notice first?',
    'What is Aadish looking for right now?',
    'Where can I find the resume?',
  ];
}
