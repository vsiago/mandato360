import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3004",
    specPattern: ".cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: ".cypress/support/e2e.{js,ts}",
    fixturesFolder: ".cypress/fixtures",
    screenshotsFolder: ".cypress/screenshots",
    videosFolder: ".cypress/videos",
    downloadsFolder: ".cypress/downloads",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
