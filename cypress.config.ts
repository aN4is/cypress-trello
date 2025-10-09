import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportHeight: 550,
    viewportWidth: 660,
    experimentalStudio: true,
    // Retry failed tests
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
