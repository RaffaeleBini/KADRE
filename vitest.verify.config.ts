// Configurazione per `npm run verify:exports`: verifica lenta dei siti esportati
// (install + tsc + build). Separata da `npm test`, che resta veloce.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.verify.ts'],
    testTimeout: 60 * 60 * 1000,
    // output in tempo reale: è un report di avanzamento, non un test silenzioso
    reporters: ['verbose'],
    disableConsoleIntercept: true,
  },
});
