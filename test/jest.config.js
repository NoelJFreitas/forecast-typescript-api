//config para testes funcionais
const { resolve } = require("path");
const root = resolve(__dirname, "..");
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  ...{
    rootDir: root,
    displayName: "end2end-tests",
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"], // arquivo de setup, roda antes do jest
    testMatch: ["<rootDir>/test/**/*.test.ts"],
  },
};
