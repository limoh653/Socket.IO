import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import NodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [
    react(),
    NodePolyfills(), // Add the polyfill plugin
  ],
  resolve: {
    alias: {
      // Polyfill global
      global: 'rollup-plugin-polyfill-node/polyfills/global.js',
    },
  },
});
