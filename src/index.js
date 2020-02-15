/**
 * Remap properties on the object
 * Ex: "info.age" => info: {age: ...}
 * @param {Object} opt Object with properties to remap
 * @param {Object} data Object if you want add data to a specific position
 */
const remapKeys = opt => {
  if (typeof opt === 'object') {
    for (let i = 0; i < Object.keys(opt).length; i++) {
      const key = Object.keys(opt)[i];

      if (opt[key] && typeof opt[key] === 'object') {
        remapKeys(opt[key]);
      }

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

/**
 * Add data to a specific position
 * Ex: "info.age" => info: {age: [data]}
 * @param {Object} opt Object with properties to remap
 * @param {Object} data Object you want add data to a specific position
 */
const addOnRemapKey = (opt, operator = '$exist') => {
  if (typeof opt === 'string') {
    opt = {
      [opt]: operator,
    };
  }
  return remapKeys(opt);
};

/**
 * Class ObjUtils
 */
export default class ObjUtils {
  static newObj = true;

  constructor(obj) {
    this.obj = obj;

    this.searchState = {
      depth: 0,
      validation: {
        position: 0,
        status: false,
        findPath: [],
      },
    };
  }

  find(conditions) {
    return this.findRecursive(this.obj, remapKeys(conditions));
  }

  findRecursive(
    obj,
    conditions,
    results = [],
    opt = { ...this.searchState }
  ) {
    // Start the properties loop
    Object.keys(obj).map(key => {
      // Manage Operator
      if (conditions[key] && conditions[key][0] === '$') {
        switch (conditions[key]) {
          case '$exist':
          case '$get':
            results.push(obj[key]);
            delete conditions[key];
            break;
          case '$delete':
            break;
          default:
        }
      }

      // Start at a specific position
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
          validation: {
            ...opt.validation,
            findPath: [...opt.validation.findPath, key],
          },
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
        // eslint-disable-next-line no-underscore-dangle
        // obj._v_path = opt.validation.findPath;
        results.push(obj);
      }

      opt.validation.position = 0;
      opt.validation.status = false;
    }

    return results;
  }

  merge(data) {
    if (data instanceof Array) {
      const results = data.map(d => this.mergeRecursive(this.obj, remapKeys(d)));
      return results;
    }

    return this.mergeRecursive(this.obj, remapKeys(data));
  }

  mergeRecursive(obj, data, opt = { ...this.searchState }) {
    Object.keys(obj).map(key => {
      console.log(key);
      if (obj[key] && typeof obj[key] === 'object') {
        if (typeof data[key] !== 'undefined') {
          console.log('rec2');
          console.log(opt, data);
          this.mergeRecursive(obj[key], data[key], {
            ...opt,
            depth: opt.depth + 1,
            validation: {
              ...opt.validation,
              position: opt.depth,
              status: true,
            },
          });

          console.log(key, opt, obj[key], data);

          // Not exist add
          if (Object.keys(data[key]).length) {
            obj[key] = Object.assign(obj[key], data[key]);
          }

          if (opt.validation.position > opt.depth) {
            delete data[key];
          }
        } else {
          console.log('rec1');
          console.log(opt, data);
          this.mergeRecursive(obj[key], obj instanceof Array ? { ...data } : data, {
            ...opt,
            depth: opt.depth + 1,
          });
        }
      } else if (typeof data[key] !== 'undefined' && obj[key] !== data[key]) {
        console.log('ookok');
        obj[key] = data[key];
        if (opt.validation.position > opt.depth) {
          delete data[key];
        }
      }

      if (
        obj[key]
        && Object.keys(data).length > 0
        && opt.depth === opt.validation.position
      ) {
        obj[key] = Object.assign(obj[key], data);
      }

      return true;
    });

    return obj;
  }

  add(position, data, newObj) {
    return this.obj.update(addOnRemapKey(position, '$exist'), data, newObj);
  }
}

/**
 * PROTOTYPES
 */
const cmds = ['update', 'find', 'add', 'merge', 'exist'];

cmds.map(cmd => {
  // eslint-disable-next-line no-extend-native
  Object.prototype[cmd] = function (...props) {
    // last element is a toggle to create a new Object
    const newObj = typeof props[props.length - 1] === 'boolean' ? props.pop() : ObjUtils.newObj;

    const self = newObj ? JSON.parse(JSON.stringify(this)) : this;
    const element = new ObjUtils(self);

    let conditions, data, position;

    switch (cmd) {
      case 'update':
        // eslint-disable-next-line no-case-declarations
        [conditions, data] = props;
        element.find(conditions, newObj).merge(data, newObj);
        break;
      case 'find':
        [conditions] = props;
        return element.find(conditions, newObj);
      case 'merge':
        [data] = props;
        return element.merge(data, newObj);
      case 'add':
        [position, data] = props;
        element.add(position, data);
        break;
      case 'exist':
        [data] = props;
        return !!this.find({
          [data]: '$exist',
        }, newObj).length;
      default:
        console.log('default');
    }

    return element.obj;
  };

  return true;
});
