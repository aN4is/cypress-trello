module.exports = {
  // Applitools configuration
  testConcurrency: 5,
  apiKey: process.env.APPLITOOLS_API_KEY,
  batchName: 'Cypress Trello Visual Tests',
  browser: [
    { width: 1280, height: 720, name: 'chrome' },
    { width: 1280, height: 720, name: 'firefox' },
    { width: 1280, height: 720, name: 'edgechromium' },
    { width: 800, height: 600, name: 'chrome' },
    { deviceName: 'iPhone X', screenOrientation: 'portrait' },
  ],
  failCypressAfterAllSpecs: false,
};
