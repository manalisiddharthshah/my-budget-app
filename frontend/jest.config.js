module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '^next(.*)': '<rootDir>/node_modules/next$1',
        '^@api/(.*)': '<rootDir>/pages/api/$1',
      },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: [
      '<rootDir>/.next/',
      '<rootDir>/node_modules/',
      '<rootDir>/out/',
    ],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
  };
  