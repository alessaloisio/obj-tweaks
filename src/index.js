export default class Update {
  constructor(obj) {
    this.obj = obj;

    this.findInitState = {
      lvl: 0,
      validation: {
        position: 0,
        status: false,
        findPath: [],
      },
    };
  }

  find(options) {
    console.log('find function :', this.findRecursive(this.obj, options));
  }

  findRecursive(
    obj,
    conditions,
    results = [],
    opt = { ...this.findInitState }
  ) {
    // Start the properties loop
    Object.keys(obj).map(key => {
      console.log(key);
      console.log(conditions[key]);
      console.log(obj[key]);
      if (obj[key] && typeof obj[key] === 'object') {
        let tmpConditions = conditions[key]
          ? { ...conditions[key] }
          : { ...conditions };

        this.findRecursive(obj[key], tmpConditions, results, {
          ...opt,
          lvl: opt.lvl + 1,
        });

        if (opt.lvl >= opt.validation.position) {
          if (!Object.keys(tmpConditions).length) {
            console.log(`!! VERSUS !! ${key}`);
            console.log(opt);
            console.log(tmpConditions);
            console.log(conditions);
            console.log('!! END VERSUS !!');
            delete conditions[key];
          }
        }
      } else if (obj[key] === conditions[key]) {
        console.log(`${key} : to validate`);
        console.log('validation :', opt);
        console.log(conditions);

        if (!opt.validation.position) {
          console.log('edited ??');
          opt.validation.position = opt.lvl;
          opt.validation.status = true;
          console.log(opt);
        }

        delete conditions[key];
        console.log(`${key} deleted`);
        console.log(conditions);
        console.log('\n');
      }
      return true;
    });

    // Validation results and clear states
    if (opt.validation.status && opt.lvl === opt.validation.position) {
      console.log(opt);
      console.log(conditions);

      if (!Object.keys(conditions).length) {
        results.push(obj);
      }

      opt = {
        ...opt,
        validation: {
          ...opt.validation,
          position: 0,
          status: false,
        },
      };

      console.log('restart validation');
    }

    return results;
  }

  merge() {
    console.log(this);
    // Object.keys(this.obj).map(key => {
    //   if (typeof data[key] !== "undefined") {
    //     if (typeof this.obj[key] === "object") {
    //       this.obj[key] = {
    //         ...this.obj[key],
    //         ...update(this.obj[key], data[key])
    //       };
    //     } else if (this.obj[key] !== data[key]) {
    //       this.obj[key] = data[key];
    //     }
    //   } else if (this.obj[key] && typeof this.obj[key] === "object") {
    //     this.obj[key] = {
    //       ...this.obj[key],
    //       ...update(this.obj[key], data)
    //     };
    //   }
    // });
  }
}

// eslint-disable-next-line no-extend-native
Object.prototype.update = function(find, options) {
  const element = new Update(this);
  element.find(find);
  // element.find(find).merge(options);
  return element.obj;
};

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

state.update(
  {
    // strat position here
    info: {
      links: {
        blog: 'https://aloisio.work',
      },
    },
  },
  { status: false }
);
// state.update({ 'info.age': 24 }, { status: false });
