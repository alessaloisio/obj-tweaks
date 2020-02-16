const expect = require('expect');
const state = require('./_state');

require('../index');

describe('Swap Commands', () => {
  test('Swap an element position', () => {
    expect(
      state
        .new()
        .swap({ _id: 123456 }, 'favourites')
    ).toStrictEqual(
      {
        data: {
          favourites: {
            123456: {
              _id: 123456, active: true, info: { age: 24, links: { blog: 'https://aloisio.work' }, name: 'Alessandro' }, status: true,
            },
            234567: {
              _id: 234567, active: true, info: { age: 24, links: { blog: 'https://atraversleslivres.be' }, name: 'Alicia' }, status: true,
            },
          },
          users: {},
        },
        error: null,
        loading: false,
      }
    );
  });
});
