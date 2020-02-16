const expect = require('expect');
const state = require('./_state');

require('../index');

describe('Operator Commands', () => {
  describe('Exist', () => {
    test('Element Exist', () => {
      expect(
        state
          .new()
          .exist('users.123456')
      ).toStrictEqual(true);
    });

    test('Element Not Exist', () => {
      expect(
        state
          .new()
          .exist('users.987544')
      ).toStrictEqual(false);
    });
  });
});
