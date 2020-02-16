const expect = require('expect');
const state = require('./_state');

require('../index');

describe('Delete Commands', () => {
  test('Delete an element', () => {
    expect(
      state
        .new()
        .delete({ _id: 123456 })
    ).toStrictEqual({
      data: {
        favourites: {
          234567: {
            _id: 234567, active: true, info: { age: 24, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia' }, status: true,
          },
        },
        users: {},
      },
      error: null,
      loading: false,
    });
  });
});
