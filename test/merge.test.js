const expect = require('expect');
const state = require('./_state');

require('../index');

describe('Merge Commands', () => {
  test('Complexe Multi Element', () => {
    expect(
      state
        .new()
        .merge({
          'info.age': 18,
          'test.test2': 'new on parent, string path',
          test2: 'new on parent',
          'info.test2': 'new on prop',
        })
    ).toStrictEqual({
      data: {
        favourites: {
          234567: {
            _id: 234567,
            active: true,
            info: {
              age: 18, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia', test2: 'new on prop',
            },
            status: true,
            test: { test2: 'new on parent, string path' },
            test2: 'new on parent',
          },
        },
        users: {
          123456: {
            _id: 123456,
            active: true,
            info: {
              age: 18, links: { blog: 'https://aloisio.work' }, name: 'Alessandro', test2: 'new on prop',
            },
            status: true,
            test: { test2: 'new on parent, string path' },
            test2: 'new on parent',
          },
        },
      },
      error: null,
      loading: false,
    });
  });

  test('Combine Find and Merge', () => {
    expect(
      state
        .new()
        .find({ _id: 123456 })
        .merge({ 'info.age': 18, status: false })
    ).toStrictEqual([{
      _id: 123456,
      active: true,
      info: { age: 18, links: { blog: 'https://aloisio.work' }, name: 'Alessandro' },
      status: false,
    }]);
  });
});
