/*!
 * Copyright (c) 2020 Aloisio Alessandro
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['obj-kit'] = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /**
   * Remap properties on the object
   * Ex: "info.age" => info: {age: ...}
   * @param {Object} opt Object with properties to remap
   * @param {Object} data Object if you want add data to a specific position
   */
  var remapKeys = function remapKeys(opt) {
    if (_typeof(opt) === 'object') {
      for (var i = 0; i < Object.keys(opt).length; i++) {
        var key = Object.keys(opt)[i];

        if (opt[key] && _typeof(opt[key]) === 'object') {
          remapKeys(opt[key]);
        }

        var indexOfKey = key.indexOf('.');

        if (indexOfKey > 0) {
          var optKey = key.substring(0, indexOfKey);
          opt[optKey] = _objectSpread2({}, opt[optKey], _defineProperty({}, key.substring(indexOfKey + 1), opt[key]));
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
      opt = _defineProperty({}, opt, operator);
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
      _classCallCheck(this, ObjUtils);

      this.obj = obj;
      this.searchState = {
        depth: 0,
        validation: {
          position: 0,
          status: false,
          findPath: []
        }
      };
      this.updated = false;
    }

    _createClass(ObjUtils, [{
      key: "find",
      value: function find(conditions) {
        return this.findRecursive(this.obj, remapKeys(conditions));
      }
    }, {
      key: "findRecursive",
      value: function findRecursive(obj, conditions) {
        var _this = this;

        var results = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _objectSpread2({}, this.searchState);
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
            }
          } // Start at a specific position


          if (!opt.validation.position && conditions[key]) {
            opt.validation.position = opt.depth;
            opt.validation.status = true;
          }

          if (obj[key] && _typeof(obj[key]) === 'object') {
            var tmpConditions = conditions[key] ? _objectSpread2({}, conditions[key]) : _objectSpread2({}, conditions);

            _this.findRecursive(obj[key], tmpConditions, results, _objectSpread2({}, opt, {
              depth: opt.depth + 1,
              validation: _objectSpread2({}, opt.validation, {
                findPath: [].concat(_toConsumableArray(opt.validation.findPath), [key])
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
            obj.constructor._v_path = opt.validation.findPath;
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

        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _objectSpread2({}, this.searchState);
        Object.keys(obj).map(function (key) {
          if (obj[key] && _typeof(obj[key]) === 'object') {
            if (data[key]) {
              opt = _objectSpread2({}, opt, {
                validation: _objectSpread2({}, opt.validation, {
                  position: opt.depth,
                  status: true
                })
              });
            }

            _this3.mergeRecursive(obj[key], data[key] ? data[key] : JSON.parse(JSON.stringify(data)), _objectSpread2({}, opt, {
              depth: opt.depth + 1
            })); // Add if not exist


            if (data[key]) {
              if (Object.keys(data[key]).length) {
                Object.keys(data[key]).map(function (newKey) {
                  return obj[key][newKey] = data[key][newKey];
                });
              }

              delete data[key];
            } // Parent of a validation


            if (Object.keys(data).length && opt.depth === opt.validation.position) {
              if (opt.validation.status || !_this3.updated) {
                Object.keys(data).map(function (newProp) {
                  if (obj instanceof Array) {
                    if (typeof obj[key][newProp] === 'undefined') {
                      obj[key][newProp] = data[newProp];
                    }
                  } else if (typeof obj[newProp] === 'undefined') {
                    obj[newProp] = data[newProp];
                  }

                  return true;
                });
                _this3.updated = true;
              }
            }
          } else if (typeof data[key] !== 'undefined') {
            // Update value
            if (data[key] !== obj[key]) {
              obj[key] = data[key];
            } // if (opt.depth >= opt.validation.position) {


            delete data[key];
          }

          return true;
        });
        return obj;
      }
    }, {
      key: "add",
      value: function add(position, data) {
        return this.obj.update(addOnRemapKey(position, '$exist'), data);
      }
    }, {
      key: "delete",
      value: function _delete(conditions) {
        var _this4 = this;

        // conditions => object
        // TODO: string conditions ?
        var elements = this.obj.find(conditions);
        var results = elements.map(function (e) {
          var vPath = e.constructor._v_path;
          var lastProp = vPath.pop();

          var lastPosition = _this4["goto"](vPath);

          if (lastPosition[lastProp]) {
            delete lastPosition[lastProp];
          }

          return _defineProperty({}, lastProp, e);
        });
        return results;
      }
    }, {
      key: "swap",
      value: function swap(conditions, position) {
        var copy = this["delete"](conditions);
        this.obj.add(position, copy);
      }
    }, {
      key: "goto",
      value: function goto(position) {
        var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.obj;

        if (position.length) {
          var key = position.reverse().pop();

          if (obj[key]) {
            obj = this["goto"](position, obj[key]);
          }
        }

        return obj;
      }
    }]);

    return ObjUtils;
  }();
  ObjUtils.newObj = false;
  /**
     * PROTOTYPES
     */

  var cmds = ['new', 'update', 'find', 'add', 'merge', 'exist', 'delete', 'swap'];
  cmds.map(function (cmd) {
    // eslint-disable-next-line no-extend-native
    Object.prototype[cmd] = function () {
      // last element is a toggle to create a new Object
      var newObj;

      for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      if (typeof props[props.length - 1] === 'boolean') {
        newObj = props.pop();
      } else if (cmd === 'new') {
        newObj = true;
      } else {
        newObj = ObjUtils.newObj;
      }

      var self = newObj ? JSON.parse(JSON.stringify(this)) : this;
      var element = new ObjUtils(self);
      var conditions, data, position;

      switch (cmd) {
        case 'update':
          conditions = props[0];
          data = props[1];
          element.find(conditions).merge(data);
          break;

        case 'add':
          position = props[0];
          data = props[1];
          element.add(position, data);
          break;

        case 'find':
          conditions = props[0];
          return element.find(conditions);

        case 'merge':
          data = props[0];
          return element.merge(data);

        case 'exist':
          data = props[0];
          return !!element.find(_defineProperty({}, data, '$exist')).length;

        case 'delete':
          conditions = props[0];
          element["delete"](conditions);
          break;

        case 'swap':
          conditions = props[0];
          position = props[1];
          element.swap(conditions, position);
          break;

      }

      return element.obj;
    };

    return true;
  });

  return ObjUtils;

})));
