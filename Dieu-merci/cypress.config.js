const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    supportFile: "cypress/support/e2e.js",
    baseUrl: "https://student.michaelkentburns.com",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    viewportWidth: 1280,
    viewportHeight: 800,
    video: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      const fs = require("fs");
      const path = require("path");

      on("after:spec", async (spec, results) => {
        if (!results) return null;

        // Determine UC folder from spec.relative (e.g. 'UC-Login/login-success.cy.js')
        const parts = spec.relative ? spec.relative.split(/\//) : [spec.name];
        const ucFolder = parts[0] || "misc";

        // Move video file into cypress/videos/<UC> if present
        try {
          if (results && results.video) {
            const videoSrc = results.video;
            const videosRoot =
              config.videosFolder || path.join("cypress", "videos");
            const destDir = path.join(videosRoot, ucFolder);
            await fs.promises.mkdir(destDir, { recursive: true });
            const videoFile = path.basename(videoSrc);
            const destPath = path.join(destDir, videoFile);
            await fs.promises.rename(videoSrc, destPath).catch(() => {});
          }

          // Move screenshots for this spec into cypress/screenshots/<UC>
          if (results && results.screenshots && results.screenshots.length) {
            const screenshotsRoot =
              config.screenshotsFolder || path.join("cypress", "screenshots");
            const destDir = path.join(screenshotsRoot, ucFolder);
            await fs.promises.mkdir(destDir, { recursive: true });
            for (const shot of results.screenshots) {
              const src = shot.path;
              const dest = path.join(destDir, path.basename(src));
              await fs.promises.rename(src, dest).catch(() => {});
            }
          }
        } catch (err) {
          // don't fail the run for post-processing errors
          // eslint-disable-next-line no-console
          console.warn("after:spec processing failed", err && err.message);
        }

        return null;
      });

      return config;
    },
  },
});
