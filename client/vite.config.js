import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
        open: true,
      },
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    proxy: {
        '/api': {
          target: 'http://localhost:5000', // Replace with your Node server URL
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
  };
});