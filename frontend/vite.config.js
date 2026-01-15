import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.1.44:5000', // ✅ Use your laptop's IP here
        changeOrigin: true,
        secure: false,
      },
    },
  },
});