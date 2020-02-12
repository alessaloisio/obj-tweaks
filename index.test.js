require('./index');

// DEMO
let state = {
  data: {
    users: {
      123456: {
        _id: 123456,
        active: true,
        status: true,
        info: {
          name: 'Alessandro',
          age: 24,
          links: {
            blog: 'https://aloisio.work',
          },
        },
      },
    },
    favourites: {
      234567: {
        _id: 234567,
        active: true,
        status: true,
        info: {
          name: 'Alicia',
          age: 24,
          links: {
            blog: 'https://atraversleslivres.be',
          },
        },
      },
    },
  },
  loading: false,
  error: null,
};

// state.update({ _id: 234567 }, { status: false });
// state.update({ _id: 234567, active: true }, { status: false });
// state.update({ active: true }, { status: false });
// state.update(
//   {
//     status: true,
//     info: { age: 24 },
//   },
//   { status: false }
// );
// state.update(
//   {
//     // strat position here
//     info: {
//       links: {
//         blog: 'https://aloisio.work',
//       },
//     },
//   },
//   { status: false }
// );
// console.log(state.update({ _id: 123456 }, { status: false, 'info.age': 18 }));
// console.log(state.find({ _id: 123456 }).merge({ 'info.age': 18 }));
// console.log(state.find({ active: true }));
// console.log(state.merge({ 'info.age': 18 }));

// console.log(
//   state.find({
//     'info.age': 24,
//   })
// );

// if not exist add
console.log(
  'demo',
  state.update(
    { _id: 123456 },
    {
      status: false,
      'info.age': 18,
      test: 'kikou',
    }
  ).data.users
);

const e = state.add('users', [
  {
    987665: {
      _id: 987665,
      active: true,
      status: true,
      info: {
        name: 'Serge',
        age: 40,
      },
    },
  },
]);
console.log(e.data);
