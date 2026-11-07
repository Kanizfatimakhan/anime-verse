// anime-verse/anime-verse/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createAssistantHandler } from './api/assistant.js';

export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'animeverse-assistant-api',
        configureServer(server) {
          server.middlewares.use(
            '/api/assistant',
            createAssistantHandler(() => process.env.GEMINI_API_KEY || serverEnv.GEMINI_API_KEY),
          );
        },
      },
    ],
    server: {
      port: 5174,
      strictPort: false,
      cors: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'gsap'],
    },
  };
});
