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

    this.updated = false;
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
        obj.constructor._v_path = opt.validation.findPath;
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
      if (obj[key] && typeof obj[key] === 'object') {
        if (data[key]) {
          opt = {
            ...opt,
            validation: {
              ...opt.validation,
              position: opt.depth,
              status: true,
            },
          };
        }

        this.mergeRecursive(
          obj[key],
          data[key] ? data[key] : JSON.parse(JSON.stringify(data)),
          { ...opt, depth: opt.depth + 1 }
        );

        // Add if not exist
        if (data[key]) {
          if (Object.keys(data[key]).length) {
            Object
              .keys(data[key])
              .map(newKey => obj[key][newKey] = data[key][newKey]);
          }

          delete data[key];
        }

        // Parent of a validation
        if (Object.keys(data).length && opt.depth === opt.validation.position) {
          if (opt.validation.status || !this.updated) {
            Object
              .keys(data)
              .map(newProp => {
                if (obj instanceof Array) {
                  if (typeof obj[key][newProp] === 'undefined') {
                    obj[key][newProp] = data[newProp];
                  }
                } else if (typeof obj[newProp] === 'undefined') {
                  obj[newProp] = data[newProp];
                }
                return true;
              });
            this.updated = true;
          }
        }
      } else if (typeof data[key] !== 'undefined') {
        // Update value
        if (data[key] !== obj[key]) {
          obj[key] = data[key];
        }

        // if (opt.depth >= opt.validation.position) {
        delete data[key];
      }


      return true;
    });

    return obj;
  }

  add(position, data) {
    return this.obj.update(
      addOnRemapKey(position, '$exist'),
      data
    );
  }

  delete(conditions) {
    // conditions => object
    // TODO: string conditions ?
    const elements = this.obj.find(conditions);

    const results = elements.map(e => {
      const vPath = e.constructor._v_path;
      const lastProp = vPath.pop();
      const lastPosition = this.goto(vPath);

      if (lastPosition[lastProp]) {
        delete lastPosition[lastProp];
      }

      return { [lastProp]: e };
    });

    return results;
  }

  swap(conditions, position) {
    const copy = this.delete(conditions);
    this.obj.add(position, copy);
  }

  goto(position, obj = this.obj) {
    if (position.length) {
      const key = position.reverse().pop();
      if (obj[key]) {
        obj = this.goto(position, obj[key]);
      }
    }

    return obj;
  }
}

ObjUtils.newObj = false;

/**
   * PROTOTYPES
   */
const cmds = ['new', 'update', 'find', 'add', 'merge', 'exist', 'delete', 'swap'];

cmds.map(cmd => {
  // eslint-disable-next-line no-extend-native
  Object.prototype[cmd] = function (...props) {
    // last element is a toggle to create a new Object
    let newObj;
    if (typeof props[props.length - 1] === 'boolean') {
      newObj = props.pop();
    } else if (cmd === 'new') {
      newObj = true;
    } else {
      newObj = ObjUtils.newObj;
    }

    const self = newObj ? JSON.parse(JSON.stringify(this)) : this;
    const element = new ObjUtils(self);

    let conditions, data, position;

    switch (cmd) {
      case 'update':
        [conditions, data] = props;
        element.find(conditions).merge(data);
        break;

      case 'add':
        [position, data] = props;
        element.add(position, data);
        break;

      case 'find':
        [conditions] = props;
        return element.find(conditions);

      case 'merge':
        [data] = props;
        return element.merge(data);

      case 'exist':
        [data] = props;
        return !!element.find({
          [data]: '$exist',
        }).length;

      case 'delete':
        [conditions] = props;
        console.log(cmd);
        element.delete(conditions);
        break;

      case 'swap':
        [conditions, position] = props;
        console.log(cmd);
        element.swap(conditions, position);
        break;

      default:
        console.log('default', cmd);
    }

    return element.obj;
  };

  return true;
});
