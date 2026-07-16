import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            external: process.platform === "linux" ? [] : [
                '@jellybrick/mpris-service'
            ]
        }
    }
});
