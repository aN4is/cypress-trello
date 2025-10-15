import { defineConfig } from 'cypress';
import eyesPlugin from '@applitools/eyes-cypress';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Load cypress.env.json and merge with process.env
const cypressEnvPath = path.join(__dirname, 'cypress.env.json');
if (fs.existsSync(cypressEnvPath)) {
  const cypressEnv = JSON.parse(fs.readFileSync(cypressEnvPath, 'utf8'));
  Object.assign(process.env, cypressEnv);
}

export default eyesPlugin(
  defineConfig({
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
      setupNodeEvents(on, config) {
        // Additional event listeners can be added here
      },
    },
  })
);
