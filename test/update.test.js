const expect = require('expect');
const state = require('./_state');

require('../index');

describe('Update Commands', () => {
  test('Multi elements update', () => {
    expect(
      state
        .new()
        .update(
          {
            active: true,
            info: { age: 24 },
          },
          { status: false }
        )
    ).toStrictEqual({
      data: {
        favourites: {
          234567: {
            _id: 234567,
            active: true,
            info: { age: 24, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia' },
            status: false,
          },
        },
        users: {
          123456: {
            _id: 123456,
            active: true,
            info: { age: 24, links: { blog: 'https://aloisio.work' }, name: 'Alessandro' },
            status: false,
          },
        },
      },
      error: null,
      loading: false,
    });
  });
});
