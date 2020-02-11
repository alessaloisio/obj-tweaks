const remapKeys = opt => {
  console.log(opt);

  Object.keys(opt).map(key => {
    console.log(key.indexOf('.'));
  });

  return opt;
};

export default class Update {
  constructor(obj) {
    this.obj = obj;

    this.findInitState = {
      depth: 0,
      validation: {
        position: 0,
        status: false,
        findPath: [],
      },
    };
  }

  find(opt) {
    return this.findRecursive(this.obj, remapKeys(opt));
  }

  findRecursive(
    obj,
    conditions,
    results = [],
    opt = { ...this.findInitState }
  ) {
    // Start the properties loop
    Object.keys(obj).map(key => {
      if (!opt.validation.position && conditions[key]) {
        opt.validation.position = opt.depth;
        opt.validation.status = true;
      }

      if (obj[key] && typeof obj[key] === 'object') {
        let tmpConditions = conditions[key]
          ? { ...conditions[key] }
          : { ...conditions };

        this.findRecursive(obj[key], tmpConditions, results, {
          ...opt,
          depth: opt.depth + 1,
        });

        if (opt.depth >= opt.validation.position) {
          if (!Object.keys(tmpConditions).length) {
            delete conditions[key];
          }
        }
      } else if (obj[key] === conditions[key]) {
        if (!opt.validation.position) {
          opt.validation.position = opt.depth;
          opt.validation.status = true;
        }

        delete conditions[key];
      }
      return true;
    });

    // Validation results and clear states
    if (opt.validation.status && opt.depth === opt.validation.position) {
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
  console.log(element.find(find));
  // element.find(find).merge(options);
  return element.obj;
};
