const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  (import.meta.env.DEV
    ? 'http://localhost:8000'
    : 'https://portfolio-phkp.onrender.com');

export const SENTIMENT_API_URL = `${API_ORIGIN}/api/sentiment`;
export const RAG_API_URL = `${API_ORIGIN}/api/rag`;
export const CHATBOT_API_URL = `${API_ORIGIN}/api/chatbot`;
