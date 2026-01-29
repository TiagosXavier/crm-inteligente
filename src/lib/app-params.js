// App Parameters - Configuração simplificada (sem Base44)

const isNode = typeof window === 'undefined';

export const appParams = {
  apiUrl: isNode ? 'http://localhost:3000/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api'),
  isDev: isNode ? true : import.meta.env.DEV,
};
