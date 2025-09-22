import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Базовый URL для тестов
    baseUrl: "http://localhost:4010",

    // Настройка viewport
    viewportWidth: 1280,
    viewportHeight: 720,

    // Настройка поддержки файлов
    supportFile: "cypress/support/e2e.ts",

    // Настройка spec файлов
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",

    // Настройка видео записи
    video: false,

    // Настройка скриншотов
    screenshotOnRunFailure: true,

    // Настройка для работы с TypeScript
    typescript: true,

    // Настройка для работы с React
    component: {
      devServer: {
        framework: "create-react-app",
        bundler: "webpack",
      },
    },
    
    // Настройка для отключения webpack-dev-server overlay
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
        }
        return launchOptions;
      });
    }
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
