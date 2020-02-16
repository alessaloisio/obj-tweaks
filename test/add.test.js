const expect = require('expect');
const state = require('./_state');

require('../index');

describe('Add Commands', () => {
  test('Add a new element at a specific position', () => {
    expect(
      state
        .new()
        .add('users', {
          987665: {
            _id: 987665,
            active: true,
            status: true,
            info: {
              name: 'Serge',
              age: 40,
            },
          },
        })
    ).toStrictEqual({
      data: {
        favourites: {
          234567: {
            _id: 234567, active: true, info: { age: 24, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia' }, status: true,
          },
        },
        users: {
          123456: {
            _id: 123456, active: true, info: { age: 24, links: { blog: 'https://aloisio.work' }, name: 'Alessandro' }, status: true,
          },
          987665: {
            _id: 987665, active: true, info: { age: 40, name: 'Serge' }, status: true,
          },
        },
      },
      error: null,
      loading: false,
    });
  });

  test('Add an element already exist but with modification', () => {
    expect(
      state
        .new()
        .add('users', {
          123456: {
            _id: 123456,
            active: true,
            status: false,
          },
        })
    ).toStrictEqual({
      data: {
        favourites: {
          234567: {
            _id: 234567, active: true, info: { age: 24, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia' }, status: true,
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
