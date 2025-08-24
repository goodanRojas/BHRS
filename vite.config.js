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
/* 
    server: {
        // host: '192.168.100.212',  // Your local IP
        // host: '192.168.100.7',  // Your local IP
        host: '192.168.3.206:8000',
        port: 5173,           // Default Vite port
        cors: {
            origin: 'http://192.168.3.206:8000',  // Allow your Laravel server
            // origin: 'http://192.168.100.7:8000',  // Allow your Laravel server
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
            allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        },
    }, */
});
