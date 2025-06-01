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
    
   /*  server: {
        host: '192.168.100.7', // Your local IP
        port: 5173,           // Default Vite port
        hmr: {
            host: '192.168.100.7', // Enable Hot Module Reload over the network
        },
    }, */
});
