import ObjUtils from './index';


// DEMO
const state = {
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

ObjUtils.newObj = false;

// console.log(state.update({ _id: 234567 }, { 'info.age': 30 }).data.favourites);
// console.log(state.update({ _id: 234567, active: true }, { status: false }).data);
// console.log(
//   state.update({ active: true }, { status: false }).data
// );

// console.log('multi conditions', state.update(
//   {
//     status: true,
//     info: { age: 24 },
//   },
//   { status: false }
// ).data);

// console.log(state.update(
//   {
//     // strat position here
//     info: {
//       links: {
//         blog: 'https://aloisio.work',
//       },
//     },
//   },
//   { status: false }
// ).data);

// console.log(state.update({ _id: 123456 }, { status: false, 'info.age': 18 }).data.users);
// console.log(state.find({ _id: 123456 }).merge({ 'info.age': 18 }));
// console.log(state.find({ active: true }));

// console.log(state.merge({
//   'info.age': 18,
//   'test.test2': 'new on parent, string path',
//   test2: 'new on parent',
//   'info.test2': 'new on prop',
// }));
// console.log('\n\nDEMO ::::');
// console.log(state.data.users);
// console.log(state.data.favourites);

// TODO
console.log(
  state.add('users', {
    987665: {
      _id: 987665,
      active: true,
      status: true,
      info: {
        name: 'Serge',
        age: 40,
      },
    },
  }).data
);

// if not exist add
// console.log(
//   'demo',
//   state.update(
//     { _id: 123456 },
//     {
//       status: false,
//       'info.age': 18,
//       'info.test': 'kikou',
//     }
//   ).data.users
// );

// console.log(state.add('users', {
//   123456: {
//     _id: 123456,
//     active: true,
//     status: false,
//   },
// }).data.users['123456']);
