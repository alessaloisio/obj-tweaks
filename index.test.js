"use strict";

require("./index");

// DEMO
var state = {
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
            blog: 'https://aloisio.work'
          }
        }
      }
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
            blog: 'https://atraversleslivres.be'
          }
        }
      }
    }
  },
  loading: false,
  error: null
}; // state.update({ _id: 234567 }, { status: false });
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
// state.update(
//   { status: true, 'info.links.blog': 'https://aloisio.work', 'info.age': 24 },
//   { status: false }
// );

console.log(state.find({
  active: true
}).merge({
  'info.age': 18
})); // console.log(state);