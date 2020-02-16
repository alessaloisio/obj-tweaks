(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ObjUtils.js":
/*!*************************!*\
  !*** ./src/ObjUtils.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ObjUtils; });\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n\n\n/**\n * Class ObjUtils\n */\nclass ObjUtils {\n  constructor(obj) {\n    this.obj = obj;\n\n    this.searchState = {\n      depth: 0,\n      validation: {\n        position: 0,\n        status: false,\n        findPath: [],\n      },\n    };\n\n    this.updated = false;\n  }\n\n  find(conditions) {\n    return this.findRecursive(this.obj, Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"remapKeys\"])(conditions));\n  }\n\n  findRecursive(\n    obj,\n    conditions,\n    results = [],\n    opt = { ...this.searchState }\n  ) {\n    // Start the properties loop\n    Object.keys(obj).map(key => {\n      // Manage Operator\n      if (conditions[key] && conditions[key][0] === '$') {\n        switch (conditions[key]) {\n          case '$exist':\n          case '$get':\n            results.push(obj[key]);\n            delete conditions[key];\n            break;\n          case '$delete':\n            break;\n          default:\n        }\n      }\n\n      // Start at a specific position\n      if (!opt.validation.position && conditions[key]) {\n        opt.validation.position = opt.depth;\n        opt.validation.status = true;\n      }\n\n      if (obj[key] && typeof obj[key] === 'object') {\n        let tmpConditions = conditions[key]\n          ? { ...conditions[key] }\n          : { ...conditions };\n\n        this.findRecursive(obj[key], tmpConditions, results, {\n          ...opt,\n          depth: opt.depth + 1,\n          validation: {\n            ...opt.validation,\n            findPath: [...opt.validation.findPath, key],\n          },\n        });\n\n        if (opt.depth >= opt.validation.position) {\n          if (!Object.keys(tmpConditions).length) {\n            delete conditions[key];\n          }\n        }\n      } else if (obj[key] === conditions[key]) {\n        if (!opt.validation.position) {\n          opt.validation.position = opt.depth;\n          opt.validation.status = true;\n        }\n\n        delete conditions[key];\n      }\n\n      return true;\n    });\n\n    // Validation results and clear states\n    if (opt.validation.status && opt.depth === opt.validation.position) {\n      if (!Object.keys(conditions).length) {\n        obj.constructor._v_path = opt.validation.findPath;\n        results.push(obj);\n      }\n\n      opt.validation.position = 0;\n      opt.validation.status = false;\n    }\n\n    return results;\n  }\n\n  merge(data) {\n    if (data instanceof Array) {\n      const results = data.map(d => this.mergeRecursive(this.obj, Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"remapKeys\"])(d)));\n      return results;\n    }\n\n    return this.mergeRecursive(this.obj, Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"remapKeys\"])(data));\n  }\n\n  mergeRecursive(obj, data, opt = { ...this.searchState }) {\n    Object.keys(obj).map(key => {\n      if (obj[key] && typeof obj[key] === 'object') {\n        if (data[key]) {\n          opt = {\n            ...opt,\n            validation: {\n              ...opt.validation,\n              position: opt.depth,\n              status: true,\n            },\n          };\n        }\n\n        this.mergeRecursive(\n          obj[key],\n          data[key] ? data[key] : JSON.parse(JSON.stringify(data)),\n          { ...opt, depth: opt.depth + 1 }\n        );\n\n        // Add if not exist\n        if (data[key]) {\n          if (Object.keys(data[key]).length) {\n            Object\n              .keys(data[key])\n              .map(newKey => obj[key][newKey] = data[key][newKey]);\n          }\n\n          delete data[key];\n        }\n\n        // Parent of a validation\n        if (Object.keys(data).length && opt.depth === opt.validation.position) {\n          if (opt.validation.status || !this.updated) {\n            Object\n              .keys(data)\n              .map(newProp => {\n                if (obj instanceof Array) {\n                  if (typeof obj[key][newProp] === 'undefined') {\n                    obj[key][newProp] = data[newProp];\n                  }\n                } else if (typeof obj[newProp] === 'undefined') {\n                  obj[newProp] = data[newProp];\n                }\n                return true;\n              });\n            this.updated = true;\n          }\n        }\n      } else if (typeof data[key] !== 'undefined') {\n        // Update value\n        if (data[key] !== obj[key]) {\n          obj[key] = data[key];\n        }\n\n        // if (opt.depth >= opt.validation.position) {\n        delete data[key];\n      }\n\n\n      return true;\n    });\n\n    return obj;\n  }\n\n  add(position, data) {\n    return this.obj.update(\n      Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"addOnRemapKey\"])(position, '$exist'),\n      data\n    );\n  }\n\n  delete(conditions) {\n    // conditions => object\n    // TODO: string conditions ?\n    const elements = this.obj.find(conditions);\n\n    const results = elements.map(e => {\n      const vPath = e.constructor._v_path;\n      const lastProp = vPath.pop();\n      const lastPosition = this.goto(vPath);\n\n      if (lastPosition[lastProp]) {\n        delete lastPosition[lastProp];\n      }\n\n      return { [lastProp]: e };\n    });\n\n    return results;\n  }\n\n  swap(conditions, position) {\n    const copy = this.delete(conditions);\n    this.obj.add(position, copy);\n  }\n\n  goto(position, obj = this.obj) {\n    if (position.length) {\n      const key = position.reverse().pop();\n      if (obj[key]) {\n        obj = this.goto(position, obj[key]);\n      }\n    }\n\n    return obj;\n  }\n}\n\nObjUtils.newObj = false;\n\n\n//# sourceURL=webpack:///./src/ObjUtils.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: remapKeys, addOnRemapKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"remapKeys\", function() { return remapKeys; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addOnRemapKey\", function() { return addOnRemapKey; });\n/**\n * Remap properties on the object\n * Ex: \"info.age\" => info: {age: ...}\n * @param {Object} opt Object with properties to remap\n * @param {Object} data Object if you want add data to a specific position\n */\nconst remapKeys = opt => {\n  if (typeof opt === 'object') {\n    for (let i = 0; i < Object.keys(opt).length; i++) {\n      const key = Object.keys(opt)[i];\n\n      if (opt[key] && typeof opt[key] === 'object') {\n        remapKeys(opt[key]);\n      }\n\n      const indexOfKey = key.indexOf('.');\n      if (indexOfKey > 0) {\n        const optKey = key.substring(0, indexOfKey);\n\n        opt[optKey] = {\n          ...opt[optKey],\n          [key.substring(indexOfKey + 1)]: opt[key],\n        };\n\n        delete opt[key];\n        i -= 1;\n      }\n    }\n  }\n\n  return opt;\n};\n\n/**\n * Add data to a specific position\n * Ex: \"info.age\" => info: {age: [data]}\n * @param {Object} opt Object with properties to remap\n * @param {Object} data Object you want add data to a specific position\n */\nconst addOnRemapKey = (opt, operator = '$exist') => {\n  if (typeof opt === 'string') {\n    opt = {\n      [opt]: operator,\n    };\n  }\n  return remapKeys(opt);\n};\n\n\n//# sourceURL=webpack:///./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: remapKeys, addOnRemapKey, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"remapKeys\", function() { return _helpers__WEBPACK_IMPORTED_MODULE_0__[\"remapKeys\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"addOnRemapKey\", function() { return _helpers__WEBPACK_IMPORTED_MODULE_0__[\"addOnRemapKey\"]; });\n\n/* harmony import */ var _ObjUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ObjUtils */ \"./src/ObjUtils.js\");\n/* harmony import */ var _prototype__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prototype */ \"./src/prototype.js\");\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_ObjUtils__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/prototype.js":
/*!**************************!*\
  !*** ./src/prototype.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ObjUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjUtils */ \"./src/ObjUtils.js\");\n\n\n/**\n   * PROTOTYPES\n   */\nconst cmds = ['new', 'update', 'find', 'add', 'merge', 'exist', 'delete', 'swap'];\n\ncmds.map(cmd => {\n  // eslint-disable-next-line no-extend-native\n  Object.prototype[cmd] = function (...props) {\n    // last element is a toggle to create a new Object\n    let newObj;\n    if (typeof props[props.length - 1] === 'boolean') {\n      newObj = props.pop();\n    } else if (cmd === 'new') {\n      newObj = true;\n    } else {\n      newObj = _ObjUtils__WEBPACK_IMPORTED_MODULE_0__[\"default\"].newObj;\n    }\n\n    const self = newObj ? JSON.parse(JSON.stringify(this)) : this;\n    const element = new _ObjUtils__WEBPACK_IMPORTED_MODULE_0__[\"default\"](self);\n\n    let conditions, data, position;\n\n    switch (cmd) {\n      case 'update':\n        [conditions, data] = props;\n        element.find(conditions).merge(data);\n        break;\n\n      case 'add':\n        [position, data] = props;\n        element.add(position, data);\n        break;\n\n      case 'find':\n        [conditions] = props;\n        return element.find(conditions);\n\n      case 'merge':\n        [data] = props;\n        return element.merge(data);\n\n      case 'exist':\n        [data] = props;\n        return !!element.find({\n          [data]: '$exist',\n        }).length;\n\n      case 'delete':\n        [conditions] = props;\n        element.delete(conditions);\n        break;\n\n      case 'swap':\n        [conditions, position] = props;\n        element.swap(conditions, position);\n        break;\n\n      default:\n      // console.log('Command not found', cmd);\n    }\n\n    return element.obj;\n  };\n\n  return true;\n});\n\n\n//# sourceURL=webpack:///./src/prototype.js?");

/***/ })

/******/ })));