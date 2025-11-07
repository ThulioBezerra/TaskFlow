import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // <-- isso faz o Vitest registrar `expect`, `describe`, etc.
    environment: 'jsdom',    // simula navegador
    setupFiles: './src/setupTests.ts', // arquivo de setup
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    preserveSymlinks: false, // força resolver para o node_modules do app
  },
  server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true }
  }
}

});
