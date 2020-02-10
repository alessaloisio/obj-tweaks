"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Update =
/*#__PURE__*/
function () {
  function Update(obj) {
    (0, _classCallCheck2.default)(this, Update);
    this.obj = obj;
    this.findInitState = {
      lvl: 0,
      validation: {
        position: 0,
        status: false,
        findPath: []
      }
    };
  }

  (0, _createClass2.default)(Update, [{
    key: "find",
    value: function find(options) {
      console.log('find function :', this.findRecursive(this.obj, options));
    }
  }, {
    key: "findRecursive",
    value: function findRecursive(obj, conditions) {
      var _this = this;

      var results = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _objectSpread({}, this.findInitState);
      // Start the properties loop
      Object.keys(obj).map(function (key) {
        console.log(key);

        if (obj[key] && (0, _typeof2.default)(obj[key]) === 'object') {
          var newConditions = conditions[key] ? conditions[key] : conditions;

          _this.findRecursive(obj[key], _objectSpread({}, newConditions), results, _objectSpread({}, opt, {
            lvl: opt.lvl + 1
          }));
        } else if (obj[key] === conditions[key]) {
          console.log("".concat(key, " : validate"));
          console.log("".concat(obj[key], " :: ").concat(conditions[key]));
          opt.validation.position = opt.lvl;
          opt.validation.status = true;
          console.log('validation :', opt);
          delete conditions[key];
          console.log(conditions);
          console.log('\n');
        }

        return true;
      });

      if (opt.validation.status && opt.lvl === opt.validation.position) {
        if (!Object.keys(conditions).length) {
          results.push(obj);
        } // Clear opt validation


        opt = _objectSpread({}, opt, {
          validation: {
            position: 0,
            status: false
          }
        });
        console.log(opt);
        console.log(conditions);
        console.log('restart validation');
      }

      return results;
    }
  }, {
    key: "merge",
    value: function merge() {
      console.log(this); // Object.keys(this.obj).map(key => {
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
  }]);
  return Update;
}(); // eslint-disable-next-line no-extend-native


exports.default = Update;

Object.prototype.update = function (find, options) {
  var element = new Update(this);
  element.find(find); // element.find(find).merge(options);

  return element.obj;
}; // DEMO


var state = {
  data: {
    users: {
      123456: {
        _id: 123456,
        active: true,
        status: true,
        info: {
          name: 'Alessandro',
          age: 24
        }
      }
    },
    favourites: {
      234567: {
        _id: 234567,
        active: true,
        status: false,
        info: {
          name: 'Alicia',
          age: 24
        }
      }
    }
  },
  loading: false,
  error: null
}; // state.update({ _id: 234567 }, { status: false });
// state.update({ _id: 234567, active: true }, { status: false });
// state.update({ active: true }, { status: false });
// state.update({ 'info.age': 24 }, { status: false });

state.update({
  info: {
    age: 24
  }
}, {
  status: false
});
module.exports = exports.default;
module.exports.default = exports.default;