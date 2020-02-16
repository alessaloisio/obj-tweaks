const expect = require('expect');
const state = require('./_state');

require('../index');

test('Create a deep copy', () => {
  expect(state.new()).toStrictEqual(state);
});
