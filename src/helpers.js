/**
 * Remap properties on the object
 * Ex: "info.age" => info: {age: ...}
 * @param {Object} opt Object with properties to remap
 * @param {Object} data Object if you want add data to a specific position
 */
export const remapKeys = opt => {
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
export const addOnRemapKey = (opt, operator = '$exist') => {
  if (typeof opt === 'string') {
    opt = {
      [opt]: operator,
    };
  }
  return remapKeys(opt);
};
