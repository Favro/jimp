"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _custom = _interopRequireDefault(require("@jimp/custom"));

var _pngjs = require("pngjs");

var _jgd = _interopRequireDefault(require("./jgd"));

function configureJimp() {
  return (0, _custom["default"])({
    types: [function () {
      return {
        mime: {
          'image/png': ['png']
        },
        constants: {
          MIME_PNG: 'image/png'
        },
        hasAlpha: {
          'image/png': true
        },
        decoders: {
          'image/png': _pngjs.PNG.sync.read
        },
        encoders: {
          'image/png': function imagePng(data) {
            var png = new _pngjs.PNG({
              width: data.bitmap.width,
              height: data.bitmap.height,
              bitDepth: 8,
              deflateLevel: data._deflateLevel,
              deflateStrategy: data._deflateStrategy,
              filterType: data._filterType,
              colorType: data._rgba ? 6 : 2,
              inputHasAlpha: true
            });
            png.data = data.bitmap.data;
            return _pngjs.PNG.sync.write(png);
          }
        }
      };
    }]
  });
}

var Jimp = typeof window !== 'undefined' && window.Jimp ? window.Jimp : configureJimp();
/**
 * Jimp constructor (from a JGD object)
 * @param data a JGD object containing the image data
 * @param cb a function to call when the image is parsed to a bitmap
 */

Jimp.appendConstructorOption('build from JGD object', function (jgd) {
  return (0, _typeof2["default"])(jgd) === 'object' && typeof jgd.width === 'number' && typeof jgd.height === 'number' && typeof jgd.data.length === 'number';
}, function (resolve, reject, jgd) {
  // `this` points to a Jimp instance
  this.bitmap = _jgd["default"].decode(jgd);
  resolve();
});
/**
 * Converts the image to a JGD object (sync fashion)
 * @returns {JGD}  JGD object
 */

Jimp.prototype.getJGDSync = function () {
  return _jgd["default"].encode(this.bitmap);
};
/**
 * Converts the image to a JGD object (async fashion)
 * @param {function(Error, Jimp)} cb a Node-style function to call with the buffer as the second argument
 * @returns {Jimp}  this for chaining of methods
 */


Jimp.prototype.getJGD = function () {
  var _this = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(_this.getJGDSync());
    } catch (error) {
      return reject(error);
    }
  });
};

var _default = Jimp;
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=jgd-wrapper.js.map