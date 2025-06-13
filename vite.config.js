import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],

    server: {
        host: '10.0.0.223',  // Your local IP
        port: 5173,           // Default Vite port
        cors: {
            origin: 'http://10.0.0.223:8000',  // Allow your Laravel server
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
            allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        },
    },
});
