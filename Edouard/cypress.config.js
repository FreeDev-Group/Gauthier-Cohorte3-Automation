const { defineConfig } = require("cypress");

module.exports = defineConfig({

  // =========================
  // GLOBAL SETTINGS
  // =========================
  viewportWidth: 1280,
  viewportHeight: 720,

  defaultCommandTimeout: 10000,
  pageLoadTimeout: 120000,
  requestTimeout: 10000,
  responseTimeout: 10000,

  // meilleure stabilité en CI / run headless
  watchForFileChanges: false,

  // =========================
  // SCREENSHOTS & VIDEOS (QA PRO)
  // =========================
  video: true,
  videoUploadOnPasses: false, // optimise stockage (PRO)

  screenshotOnRunFailure: true,

  screenshotsFolder: "cypress/reports/screenshots",
  videosFolder: "cypress/reports/videos",

  // =========================
  // REPORTER (MOCHAWESOME)
  // =========================
  reporter: "cypress-mochawesome-reporter",

  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: "Cypress Test Report",
    embeddedScreenshots: true,
    inlineAssets: true
  },

  // =========================
  // E2E CONFIG
  // =========================
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",

    setupNodeEvents(on, config) {

      // =========================
      // REPORTER PLUGIN
      // =========================
      require("cypress-mochawesome-reporter/plugin")(on);

      // =========================
      // AUTO SCREENSHOT HOOK (ALL TESTS)
      // =========================
      on("after:spec", (spec, results) => {
        // permet log QA propre par spec
        console.log(`✔ Finished spec: ${spec.relative}`);
      });

      return config;
    }
  }
});
