import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // Relative asset paths in production builds so the app works from any
  // sub-path, e.g. GitHub Pages at https://<user>.github.io/chow/
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
}));
