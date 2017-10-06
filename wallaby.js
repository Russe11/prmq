module.exports = function () {
  return {
    files: [
      'src/**/*.ts',
      '!src/tests/**/*.ts',
    ],

    tests: [
      'src/tests/**/*.tests.ts',
    ],
  };
};
