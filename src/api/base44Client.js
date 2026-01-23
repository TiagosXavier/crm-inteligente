// Base44 SDK REMOVIDO - Agora usando backend próprio
// Este arquivo mantém compatibilidade mas usa a API própria

import { api } from './apiClient.js';

// Export API client como se fosse o base44 para manter compatibilidade
export const base44 = api;

console.log('✅ Using own backend API (Base44 SDK removed)');
console.log('💡 Backend: http://localhost:3000/api');
