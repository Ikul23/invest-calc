import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

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
            publicDirectory: 'public',          // 👈 обязательно
            buildDirectory: 'build',            // 👈 тоже обязательно
        }),
        react(),
    ],
    build: {
        outDir: 'public/build',                 // 👈 совпадает с buildDirectory
        emptyOutDir: true,
        manifest: true,
            chunkSizeWarningLimit: 1000,
        manifestFileName: 'manifest.json',     // 👈 Laravel ищет именно это
    },
    base: '/build/',
})
