import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        commonjsOptions: { include: [/node_modules/, /generated/] },
        rollupOptions: {
            external: [
                '@microsoft/dynwinrt',
                ...(process.platform === 'linux' ? [] : ['@jellybrick/mpris-service']),
            ]
        }
    }
});
