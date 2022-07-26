"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Jimp = void 0;
exports.donutJGD = donutJGD;
exports.getTestDir = getTestDir;
exports.hasOwnProp = hasOwnProp;
exports.hashForEach = hashForEach;
exports.isWeb = isWeb;
exports.jgdReadableMatrix = jgdReadableMatrix;
exports.jgdToStr = jgdToStr;
exports.mkJGD = mkJGD;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _should = _interopRequireDefault(require("should"));

// Ensure should to load in browser through browserify.
var Jimp = require('./jgd-wrapper'); // eslint-disable-next-line no-use-extend-native/no-use-extend-native


exports.Jimp = Jimp;
var shouldAssertion = {}.should.be.constructor.prototype;

function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function hashForEach(hash, func) {
  for (var key in hash) {
    if (hasOwnProp(hash, key)) func(key, hash[key]);
  }
}

function getTestDir(dir) {
  var testRE = /\/[^/]+\.test\.js($|\?.*)/;

  if (typeof document !== 'undefined' && document && document.getElementsByTagName) {
    var scripts = document.querySelectorAll('script');
    var testScript = (0, _toConsumableArray2["default"])(scripts).find(function (script) {
      return script.src.match(testRE) && script.src.includes(dir);
    });

    if (testScript) {
      return testScript.src.replace(testRE, '');
    }

    throw new TypeError('Cant discover the web test directory');
  } else {
    if (typeof dir === 'undefined') {
      throw new TypeError('Cant discover the env test directory');
    }

    return dir;
  }
}

function isWeb(warn) {
  if (typeof window !== 'undefined' && window.document) {
    console.warn(warn);
    return true;
  }

  return false;
}

var sup = '⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠ';

function jgdReadableMatrix(img) {
  var rMatrix = [];
  var line = [];
  var len = img.data.length;

  for (var i = 0; i < len; i++) {
    var pix = img.data[i].toString(16).toUpperCase();

    while (pix.length < 8) {
      pix = '0' + pix;
    }

    line.push(pix.replace(/(..)(..)(..)(.)(.)/, function (sel, r, g, b, a1, a2) {
      var a = sup[parseInt(a1, 16)] + sup[parseInt(a2, 16)];
      return r + '-' + g + '-' + b + a;
    }));

    if (i > 0 && (i + 1) % img.width === 0) {
      rMatrix.push(line.join(' '));
      line = [];
    }
  }

  return rMatrix.join('\n');
}

shouldAssertion.sameJGD = function (targetJGD, message) {
  message = message ? ' ' + message : '';
  var testJGD = this.obj;

  _should["default"].exist(testJGD.width, 'Width was not defined.' + message);

  _should["default"].exist(testJGD.height, 'Height was not defined.' + message);

  testJGD.width.should.be.equal(targetJGD.width, 'Width is not the expected.' + message);
  testJGD.height.should.be.equal(targetJGD.height, 'Height is not the expected.' + message);
  var matrixMsg = message || 'The pixel matrix is not the expected.';
  jgdReadableMatrix(testJGD).should.be.equal(jgdReadableMatrix(targetJGD), matrixMsg);
};

function donutJGD(_, i, X) {
  /* eslint comma-spacing: off */
  return {
    width: 10,
    height: 10,
    data: [_, _, _, _, _, _, _, _, _, _, _, _, _, i, X, X, i, _, _, _, _, _, X, X, X, X, X, X, _, _, _, i, X, X, i, i, X, X, i, _, _, X, X, i, _, _, i, X, X, _, _, X, X, i, _, _, i, X, X, _, _, i, X, X, i, i, X, X, i, _, _, _, X, X, X, X, X, X, _, _, _, _, _, i, X, X, i, _, _, _, _, _, _, _, _, _, _, _, _, _]
  };
}

var colors = {
  '▴': 0xff0000ff,
  // Red
  '▵': 0xff00007f,
  // Red half-alpha
  '▸': 0x00ff00ff,
  // Green
  '▹': 0x00ff007f,
  // Green half-alpha
  '▾': 0x0000ffff,
  // Blue
  '▿': 0x0000ff7f,
  // Blue half-alpha
  '◆': 0xffff00ff,
  // Yellow
  '◇': 0xffff007f,
  // Yellow half-alpha
  '▪': 0x00ffffff,
  // Cyan
  '▫': 0x00ffff7f,
  // Cyan half-alpha
  '▰': 0xff00ffff,
  // Magenta
  '▱': 0xff00ff7f,
  // Magenta half-alpha
  ' ': 0x00000000,
  // Transparent black
  '■': 0x000000ff,
  // Black
  '0': 0x000000ff,
  // Black
  '1': 0x111111ff,
  '2': 0x222222ff,
  '3': 0x333333ff,
  '▩': 0x404040ff,
  // Dark gray (1/4 white)
  '4': 0x444444ff,
  '5': 0x555555ff,
  '6': 0x666666ff,
  '7': 0x777777ff,
  '8': 0x888888ff,
  '▦': 0x808080ff,
  // Half gray (1/2 white)
  '9': 0x999999ff,
  A: 0xaaaaaaff,
  B: 0xbbbbbbff,
  '▥': 0xbfbfbfff,
  // Light gray (3/4 white)
  C: 0xccccccff,
  D: 0xddddddff,
  E: 0xeeeeeeff,
  F: 0xffffffff,
  // White
  '□': 0xffffffff // White

};

function throwUndefinedChar(_char) {
  var cList = [];
  hashForEach(colors, function (k, c) {
    c = c.toString(16);

    while (c.length < 8) {
      c = '0' + c;
    }

    cList.push(k + '=' + c);
  });
  throw new Error('The char "' + _char + '" do not defines a color. ' + 'This are the valid chars: ' + cList.join(' '));
}
/* Build a JGD object from a list of strings */


function mkJGD() {
  var jgd = {
    width: 0,
    height: arguments.length,
    data: []
  };

  for (var y = 0; y < jgd.height; y++) {
    var line = y < 0 || arguments.length <= y ? undefined : arguments[y];
    jgd.width = line.length;
    var w = jgd.width;

    for (var x = 0; x < w; x++) {
      if (typeof colors[line[x]] === 'undefined') {
        throwUndefinedChar(line[x]);
      } else {
        jgd.data[y * w + x] = colors[line[x]];
      }
    }
  }

  return jgd;
} // Helps to debug image data


function jgdToStr(jgd) {
  var colors2 = {};
  hashForEach(colors, function (k, c) {
    colors2[c] = k;
  });
  var lines = [];
  var w = jgd.width;

  for (var y = 0; y < jgd.height; y++) {
    lines[y] = '';

    for (var x = 0; x < w; x++) {
      var k = colors2[jgd.data[y * w + x]] || '?';
      lines[y] += k;
    }
  }

  return lines.map(function (l) {
    return "'" + l + "'";
  }).join('\n');
}
//# sourceMappingURL=index.js.map