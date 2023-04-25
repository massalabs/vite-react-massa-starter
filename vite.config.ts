import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [viteCommonjs(), react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            events: 'rollup-plugin-node-polyfills/polyfills/events',
            crypto: 'crypto-browserify',
            stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        },
    },
    define: {
        'process.env': process.env ?? {},
    },
    build: {
        target: 'ESNext',
        sourcemap: true,
        rollupOptions: {
            plugins: [
                inject({
                    Buffer: ['buffer', 'Buffer'],
                }),
            ],
        },
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'ESNext',
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis',
            },
        },
    },
});
