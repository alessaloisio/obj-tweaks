"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Remap properties on the object
 * Ex: "info.age" => info: {age: ...}
 * @param {Object} opt Object with properties to remap
 * @param {Object} data Object if you want add data to a specific position
 */
var remapKeys = function remapKeys(opt) {
  if ((0, _typeof2.default)(opt) === 'object') {
    for (var i = 0; i < Object.keys(opt).length; i++) {
      var key = Object.keys(opt)[i];

      if (opt[key] && (0, _typeof2.default)(opt[key]) === 'object') {
        remapKeys(opt[key]);
      }

      var indexOfKey = key.indexOf('.');

      if (indexOfKey > 0) {
        var optKey = key.substring(0, indexOfKey);
        opt[optKey] = _objectSpread({}, opt[optKey], (0, _defineProperty2.default)({}, key.substring(indexOfKey + 1), opt[key]));
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


var addOnRemapKey = function addOnRemapKey(opt) {
  var operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '$exist';

  if (typeof opt === 'string') {
    opt = (0, _defineProperty2.default)({}, opt, operator);
  }

  return remapKeys(opt);
};
/**
 * Class ObjUtils
 */


var ObjUtils =
/*#__PURE__*/
function () {
  function ObjUtils(obj) {
    (0, _classCallCheck2.default)(this, ObjUtils);
    this.obj = obj;
    this.searchState = {
      depth: 0,
      validation: {
        position: 0,
        status: false,
        findPath: []
      }
    };
  }

  (0, _createClass2.default)(ObjUtils, [{
    key: "find",
    value: function find(conditions) {
      return this.findRecursive(this.obj, remapKeys(conditions));
    }
  }, {
    key: "findRecursive",
    value: function findRecursive(obj, conditions) {
      var _this = this;

      var results = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _objectSpread({}, this.searchState);
      // Start the properties loop
      Object.keys(obj).map(function (key) {
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
        } // Start at a specific position


        if (!opt.validation.position && conditions[key]) {
          opt.validation.position = opt.depth;
          opt.validation.status = true;
        }

        if (obj[key] && (0, _typeof2.default)(obj[key]) === 'object') {
          var tmpConditions = conditions[key] ? _objectSpread({}, conditions[key]) : _objectSpread({}, conditions);

          _this.findRecursive(obj[key], tmpConditions, results, _objectSpread({}, opt, {
            depth: opt.depth + 1,
            validation: _objectSpread({}, opt.validation, {
              findPath: [].concat((0, _toConsumableArray2.default)(opt.validation.findPath), [key])
            })
          }));

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
      }); // Validation results and clear states

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
  }, {
    key: "merge",
    value: function merge(data) {
      var _this2 = this;

      if (data instanceof Array) {
        var results = data.map(function (d) {
          return _this2.mergeRecursive(_this2.obj, remapKeys(d));
        });
        return results;
      }

      return this.mergeRecursive(this.obj, remapKeys(data));
    }
  }, {
    key: "mergeRecursive",
    value: function mergeRecursive(obj, data) {
      var _this3 = this;

      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objectSpread({}, this.searchState);
      Object.keys(obj).map(function (key) {
        if (obj[key] && (0, _typeof2.default)(obj[key]) === 'object') {
          if (data[key]) {
            opt = _objectSpread({}, opt, {
              validation: _objectSpread({}, opt.validation, {
                position: opt.depth,
                status: true
              })
            });
          }

          _this3.mergeRecursive(obj[key], data[key] ? data[key] : JSON.parse(JSON.stringify(data)), _objectSpread({}, opt, {
            depth: opt.depth + 1
          })); // Add if not exist


          if (data[key]) {
            if (Object.keys(data[key]).length) {
              Object.keys(data[key]).map(function (newKey) {
                return obj[key][newKey] = data[key][newKey];
              });
            }

            delete data[key];
          }

          if (opt.depth === opt.validation.position) {
            if (obj instanceof Array) {
              // Parent of a find
              obj[key] = Object.assign(obj[key], data);
            } else {
              // Parent of a validation
              obj = Object.assign(obj, data);
            }
          }
        } else if (data[key] && data[key] !== obj[key]) {
          // Update value
          obj[key] = data[key];

          if (opt.depth >= opt.validation.position) {
            delete data[key];
          }
        }

        return true;
      });
      return obj;
    }
  }, {
    key: "add",
    value: function add(position, data, newObj) {
      return this.obj.update(addOnRemapKey(position, '$exist'), data, newObj);
    }
  }]);
  return ObjUtils;
}();

exports.default = ObjUtils;
ObjUtils.newObj = true;
/**
 * PROTOTYPES
 */

var cmds = ['update', 'find', 'add', 'merge', 'exist'];
cmds.map(function (cmd) {
  // eslint-disable-next-line no-extend-native
  Object.prototype[cmd] = function () {
    for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    // last element is a toggle to create a new Object
    var newObj = typeof props[props.length - 1] === 'boolean' ? props.pop() : ObjUtils.newObj;
    var self = newObj ? JSON.parse(JSON.stringify(this)) : this;
    var element = new ObjUtils(self);
    var conditions, data, position;

    switch (cmd) {
      case 'update':
        // eslint-disable-next-line no-case-declarations
        conditions = props[0];
        data = props[1];
        element.find(conditions, newObj).merge(data, newObj);
        break;

      case 'find':
        conditions = props[0];
        return element.find(conditions, newObj);

      case 'merge':
        data = props[0];
        return element.merge(data, newObj);

      case 'add':
        position = props[0];
        data = props[1];
        element.add(position, data);
        break;

      case 'exist':
        data = props[0];
        return !!this.find((0, _defineProperty2.default)({}, data, '$exist'), newObj).length;

      default:
        console.log('default');
    }

    return element.obj;
  };

  return true;
});
module.exports = exports.default;
module.exports.default = exports.default;