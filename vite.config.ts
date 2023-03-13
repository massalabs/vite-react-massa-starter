import { defineConfig } from 'vite';
import nodePolyfills2 from 'vite-plugin-node-stdlib-browser';
import inject from '@rollup/plugin-inject';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { resolve } from 'path';
import nodeStdlibBrowser from 'node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [viteCommonjs(), react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            events: 'rollup-plugin-node-polyfills/polyfills/events',
            assert: 'assert',
            crypto: 'crypto-browserify',
            util: 'util',
            http: 'stream-http',
            https: 'https-browserify',
            url: 'url',
            os: 'os-browserify/browser',
            zlib: 'browserify-zlib',

            path: 'rollup-plugin-node-polyfills/polyfills/path',
            querystring: 'rollup-plugin-node-polyfills/polyfills/qs',

            constants: 'rollup-plugin-node-polyfills/polyfills/constants',
            timers: 'rollup-plugin-node-polyfills/polyfills/timers',
            console: 'rollup-plugin-node-polyfills/polyfills/console',
            vm: 'rollup-plugin-node-polyfills/polyfills/vm',
            tty: 'rollup-plugin-node-polyfills/polyfills/tty',
            domain: 'rollup-plugin-node-polyfills/polyfills/domain',

            stream: 'rollup-plugin-node-polyfills/polyfills/stream',
            _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
            _stream_passthrough:
                'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
            _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
            _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
            _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
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
