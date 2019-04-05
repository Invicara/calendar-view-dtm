module.exports = {
  collectCoverageFrom: ["./src/**/*.js"],
  modulePathIgnorePatterns: ["<rootDir>/src/dev.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
