import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ejercicio-zalcu/',
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['legacy_cra/**', 'tests/**'],
  },
});

