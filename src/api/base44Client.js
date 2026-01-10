import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, serverUrl, token, functionsVersion } = appParams;

// Check if Base44 is configured
const isBase44Configured = appId && appId !== 'null' && serverUrl && serverUrl !== 'null';

// Use mock client if Base44 is not configured (development mode)
let base44Client;

if (!isBase44Configured && import.meta.env.DEV) {
  console.log('⚠️  Base44 credentials not configured - using mock data');
  console.log('💡 To use real Base44, configure VITE_BASE44_APP_ID and VITE_BASE44_BACKEND_URL in .env');

  // Dynamically import mock client
  const mockModule = await import('./mockBase44Client.js');
  base44Client = mockModule.base44;
} else {
  // Create real client with authentication
  base44Client = createClient({
    appId,
    serverUrl,
    token,
    functionsVersion,
    requiresAuth: false
  });
}

export const base44 = base44Client;
