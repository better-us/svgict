module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  watchPathIgnorePatterns: ['/node_modules/'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/src/__tests__/**/*.(test|spec).[jt]s?(x)'],
};
