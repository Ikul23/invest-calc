import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
    host: '0.0.0.0',
    port: 5173,
    origin: 'http://localhost:5173',
    cors: true,
    proxy: {
    '/api': 'http://localhost:8000',
  },
},
    plugins: [
        laravel({
            input: 'resources/js/main.jsx',
            refresh: true,
            buildDirectory: 'build',
        }),
        react(),
    ],
    build: {
        outDir: 'public/build',
    emptyOutDir: true,
    manifest: true,
        chunkSizeWarningLimit: 1000,
    },
    base: '/build/',
});
