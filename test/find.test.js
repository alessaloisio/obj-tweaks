const expect = require('expect');
const state = require('./_state');

require('../index');

describe('Find Commands', () => {
  test('Find a specific element', () => {
    expect(
      state
        .new()
        .find({ _id: 123456 })
    ).toStrictEqual([state.data.users[123456]]);
  });

  test('Find multi element', () => {
    expect(
      state
        .new()
        .find({ active: true })
    ).toStrictEqual([
      state.data.users[123456],
      state.data.favourites[234567],
    ]);
  });
});
