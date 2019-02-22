module.exports = {
  setupFilesAfterEnv: ['jest-enzyme'],
  testEnvironment: 'enzyme',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16',
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
};
