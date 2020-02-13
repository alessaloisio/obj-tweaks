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
 * Class UPDATE
 */


var Update =
/*#__PURE__*/
function () {
  function Update(obj) {
    (0, _classCallCheck2.default)(this, Update);
    this.obj = obj;
    this.findInitState = {
      depth: 0,
      validation: {
        position: 0,
        status: false,
        findPath: []
      }
    };
  }

  (0, _createClass2.default)(Update, [{
    key: "find",
    value: function find(opt) {
      return this.findRecursive(this.obj, remapKeys(opt));
    }
  }, {
    key: "findRecursive",
    value: function findRecursive(obj, conditions) {
      var _this = this;

      var results = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _objectSpread({}, this.findInitState);
      // Start the properties loop
      Object.keys(obj).map(function (key) {
        // Manage Operator
        if (conditions[key] && conditions[key][0] === '$') {
          switch (conditions[key]) {
            case '$exist':
            case '$get':
              results.push(obj[key]);
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
    value: function merge(opt) {
      var _this2 = this;

      if (opt instanceof Array) {
        var results = opt.map(function (d) {
          return _this2.mergeRecursive(_this2.obj, remapKeys(d));
        });
        return results;
      }

      return this.mergeRecursive(this.obj, remapKeys(opt));
    }
  }, {
    key: "mergeRecursive",
    value: function mergeRecursive(obj, data) {
      var _this3 = this;

      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objectSpread({}, this.findInitState);
      Object.keys(obj).map(function (key) {
        if (obj[key] && (0, _typeof2.default)(obj[key]) === 'object') {
          if (typeof data[key] !== 'undefined') {
            _this3.mergeRecursive(obj[key], data[key], _objectSpread({}, opt, {
              depth: opt.depth + 1
            }));

            if (Object.keys(data[key]).length) {
              obj[key] = Object.assign(obj[key], data[key]);
            }

            delete data[key];
          } else {
            _this3.mergeRecursive(obj[key], data, _objectSpread({}, opt, {
              depth: opt.depth + 1
            }));
          }
        } else if (typeof data[key] !== 'undefined' && obj[key] !== data[key]) {
          obj[key] = data[key];
          delete data[key];
        }

        if (Object.keys(data).length > 0 && !opt.depth) {
          obj[key] = Object.assign(obj[key], data);
        }

        return true;
      });
      return obj;
    }
  }, {
    key: "add",
    value: function add(position, data) {
      return this.obj.update(addOnRemapKey(position, '$exist'), data, false);
    }
  }]);
  return Update;
}();
/**
 * PROTOTYPES
 */
// eslint-disable-next-line no-extend-native


exports.default = Update;

Object.prototype.update = function (find, data) {
  var newObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var self = newObj ? JSON.parse(JSON.stringify(this)) : this;
  var element = new Update(self);
  element.find(find).merge(data);
  return element.obj;
}; // eslint-disable-next-line no-extend-native


Object.prototype.add = function (position, data) {
  var newObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var self = newObj ? JSON.parse(JSON.stringify(this)) : this;
  var element = new Update(self);
  element.add(position, data);
  return element.obj;
}; // eslint-disable-next-line no-extend-native


Object.prototype.merge = function (data) {
  var element = new Update(this);
  return element.merge(data);
}; // eslint-disable-next-line no-extend-native


Object.prototype.find = function (data) {
  var element = new Update(this);
  return element.find(data);
};

module.exports = exports.default;
module.exports.default = exports.default;