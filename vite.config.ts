import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@social': path.resolve(__dirname, './src/context/social'),
        '@layouts': path.resolve(__dirname, './src/layout'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@api': path.resolve(__dirname, './src/config/api'),
        '@config': path.resolve(__dirname, './src/config'),
        '@http': path.resolve(__dirname, './src/shared/http'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
