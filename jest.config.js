module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|@reduxjs/toolkit|redux-persist|@react-native-async-storage|@react-native-community|redux|redux-thunk|reselect|immer)/)',
  ],
};
