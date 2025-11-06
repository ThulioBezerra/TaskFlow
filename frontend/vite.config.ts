import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // <-- isso faz o Vitest registrar `expect`, `describe`, etc.
    environment: 'jsdom',    // simula navegador
    setupFiles: './src/setupTests.ts', // arquivo de setup
  },
});
