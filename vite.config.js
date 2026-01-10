import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
  // Use root path for Vercel, GitHub Pages path for gh-pages deploy
  const isVercel = process.env.VERCEL === '1';
  const base = command === 'build' && !isVercel ? '/crm-inteligente/' : '/';

  return {
    base,
    plugins: [
      base44({
        legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true'
      }),
      react(),
    ],
  };
});