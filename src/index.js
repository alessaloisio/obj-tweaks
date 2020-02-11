/**
 * Remap properties on the object
 * Ex: "info.age" => info: {age: ...}
 * @param {Object} opt Object with properties to remap
 */
const remapKeys = opt => {
  for (let i = 0; i < Object.keys(opt).length; i++) {
    const key = Object.keys(opt)[i];

    if (opt[key] && typeof opt[key] === 'object') {
      remapKeys(opt[key]);
    } else {
      const indexOfKey = key.indexOf('.');
      if (indexOfKey > 0) {
        const optKey = key.substring(0, indexOfKey);

        opt[optKey] = {
          ...opt[optKey],
          [key.substring(indexOfKey + 1)]: opt[key],
        };

        delete opt[key];
        i -= 1;
      }
    }
  }

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

  merge(opt) {
    return this.mergeRecursive(this.obj, remapKeys(opt));
  }

  mergeRecursive(obj, data) {
    Object.keys(obj).map(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        if (typeof data[key] !== 'undefined') {
          this.mergeRecursive(obj[key], data[key]);
        } else {
          this.mergeRecursive(obj[key], data);
        }
      } else if (typeof data[key] !== 'undefined' && obj[key] !== data[key]) {
        obj[key] = data[key];
      }
    });

    return obj;
  }
}

// eslint-disable-next-line no-extend-native
Object.prototype.update = function(find, opt) {
  const element = new Update(this);
  element.find(find).merge(opt);
  return element.obj;
};

// eslint-disable-next-line no-extend-native
Object.prototype.merge = function(opt) {
  const element = new Update(this);
  return element.merge(opt);
};

// eslint-disable-next-line no-extend-native
Object.prototype.find = function(opt) {
  const element = new Update(this);
  return element.find(opt);
};
