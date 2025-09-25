module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
