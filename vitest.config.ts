import { defineConfig } from 'vitest/config';
import path from 'path';

// I test unitari coprono helper puri (gate, mascheramento R7, url funnel, registry pillar).
// Il rendering dei componenti UI si verifica via Playwright, non qui (env node basta).
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
