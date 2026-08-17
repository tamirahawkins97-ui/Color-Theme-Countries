import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'countries1.html'),
        details: resolve(import.meta.dirname, 'countries2.html'),
      },
    },
  },
  server: {
    open: '/countries1.html', // Automatically opens countries1.html in your browser
  },
});