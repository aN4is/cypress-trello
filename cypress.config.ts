import { defineConfig } from "cypress";
import eyesPlugin from '@applitools/eyes-cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      eyesPlugin(this);
      return config;
    },
    baseUrl: 'http://localhost:3000',
    viewportHeight: 550,
    viewportWidth: 660,
    experimentalStudio: true,
  },
});
