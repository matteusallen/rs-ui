module.exports = {
  setupFiles: ['<rootDir>/setupTests.js', 'react-app-polyfill/jsdom'],
  testMatch: ['<rootDir>/src/**/__tests__/**/?(*.)(spec|test).{js,jsx,ts,tsx}'],
  testEnvironment: 'jsdom',
  globals: {
    APP_CONFIG: {
      api: {
        url: 'http://localhost:5000'
      }
    }
  },
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$', '^.+\\.module\\.(css|sass|scss)$'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    '^Assets(.*)$': '<rootDir>/src/assets',
    '^Components(.*)$': '<rootDir>/src/components$1',
    '^Constants(.*)$': '<rootDir>/src/constants$1',
    '^Helpers(.*)$': '<rootDir>/src/helpers$1',
    '^Hooks(.*)$': '<rootDir>/src/hooks$1',
    '^Lib(.*)$': '<rootDir>/src/lib$1',
    '^Mutations(.*)$': '<rootDir>/src/mutations$1',
    '^Pages(.*)$': '<rootDir>/src/pages$1',
    '^Queries(.*)$': '<rootDir>/src/queries$1',
    '^Store(.*)$': '<rootDir>/src/store$1',
    '^Styles(.*)$': '<rootDir>/src/styles$1',
    '^Types(.*)$': '<rootDir>/src/types$1',
    '^Utils(.*)$': '<rootDir>/src/utils$1'
  }
};
