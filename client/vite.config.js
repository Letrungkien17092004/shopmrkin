// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 9000
    },
    // publicDir: "/public",
    plugins: [
        react({
            babel: {
                babelrc: true
            }
        }),
        tailwindcss()
    ],
});