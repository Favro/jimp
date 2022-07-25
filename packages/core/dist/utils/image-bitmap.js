'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _typeof = require('@babel/runtime/helpers/typeof');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getBuffer = getBuffer;
exports.getBufferAsync = getBufferAsync;
exports.parseBitmap = parseBitmap;

var _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator')
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray')
);

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator')
);

var _exifParser = _interopRequireDefault(require('exif-parser'));

var _utils = require('@jimp/utils');

var constants = _interopRequireWildcard(require('../constants'));

var MIME = _interopRequireWildcard(require('./mime'));

var _promisify = _interopRequireDefault(require('./promisify'));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(
    nodeInterop
  ) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== 'object' && typeof obj !== 'function')
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj['default'] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

var fileTypeFromBuffer = /*#__PURE__*/ (function() {
  var _ref = (0, _asyncToGenerator2['default'])(
    /*#__PURE__*/ _regenerator['default'].mark(function _callee(buf) {
      return _regenerator['default'].wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.t0 = fileTypeFromBuffer._cached;

              if (_context.t0) {
                _context.next = 5;
                break;
              }

              _context.next = 4;
              return eval("import('file-type')");

            case 4:
              _context.t0 = _context.sent.fileTypeFromBuffer;

            case 5:
              fileTypeFromBuffer._cached = _context.t0;
              return _context.abrupt('return', fileTypeFromBuffer._cached(buf));

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    })
  );

  return function fileTypeFromBuffer(_x2) {
    return _ref.apply(this, arguments);
  };
})();

function getMIMEFromBuffer(_x3, _x4) {
  return _getMIMEFromBuffer.apply(this, arguments);
}
/*
 * Obtains image orientation from EXIF metadata.
 *
 * @param img {Jimp} a Jimp image object
 * @returns {number} a number 1-8 representing EXIF orientation,
 *          in particular 1 if orientation tag is missing
 */

function _getMIMEFromBuffer() {
  _getMIMEFromBuffer = (0, _asyncToGenerator2['default'])(
    /*#__PURE__*/ _regenerator['default'].mark(function _callee2(buffer, path) {
      var fileType;
      return _regenerator['default'].wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              _context2.next = 2;
              return fileTypeFromBuffer(buffer);

            case 2:
              fileType = _context2.sent;

              if (!fileType) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt('return', fileType.mime);

            case 5:
              if (!path) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', MIME.getType(path));

            case 7:
              return _context2.abrupt('return', null);

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2);
    })
  );
  return _getMIMEFromBuffer.apply(this, arguments);
}

function getExifOrientation(img) {
  return (img._exif && img._exif.tags && img._exif.tags.Orientation) || 1;
}
/**
 * Returns a function which translates EXIF-rotated coordinates into
 * non-rotated ones.
 *
 * Transformation reference: http://sylvana.net/jpegcrop/exif_orientation.html.
 *
 * @param img {Jimp} a Jimp image object
 * @returns {function} transformation function for transformBitmap().
 */

function getExifOrientationTransformation(img) {
  var w = img.getWidth();
  var h = img.getHeight();

  switch (getExifOrientation(img)) {
    case 1:
      // Horizontal (normal)
      // does not need to be supported here
      return null;

    case 2:
      // Mirror horizontal
      return function(x, y) {
        return [w - x - 1, y];
      };

    case 3:
      // Rotate 180
      return function(x, y) {
        return [w - x - 1, h - y - 1];
      };

    case 4:
      // Mirror vertical
      return function(x, y) {
        return [x, h - y - 1];
      };

    case 5:
      // Mirror horizontal and rotate 270 CW
      return function(x, y) {
        return [y, x];
      };

    case 6:
      // Rotate 90 CW
      return function(x, y) {
        return [y, h - x - 1];
      };

    case 7:
      // Mirror horizontal and rotate 90 CW
      return function(x, y) {
        return [w - y - 1, h - x - 1];
      };

    case 8:
      // Rotate 270 CW
      return function(x, y) {
        return [w - y - 1, x];
      };

    default:
      return null;
  }
}
/*
 * Transforms bitmap in place (moves pixels around) according to given
 * transformation function.
 *
 * @param img {Jimp} a Jimp image object, which bitmap is supposed to
 *        be transformed
 * @param width {number} bitmap width after the transformation
 * @param height {number} bitmap height after the transformation
 * @param transformation {function} transformation function which defines pixel
 *        mapping between new and source bitmap. It takes a pair of coordinates
 *        in the target, and returns a respective pair of coordinates in
 *        the source bitmap, i.e. has following form:
 *        `function(new_x, new_y) { return [src_x, src_y] }`.
 */

function transformBitmap(img, width, height, transformation) {
  // Underscore-prefixed values are related to the source bitmap
  // Their counterparts with no prefix are related to the target bitmap
  var _data = img.bitmap.data;
  var _width = img.bitmap.width;
  var data = Buffer.alloc(_data.length);

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var _transformation = transformation(x, y),
        _transformation2 = (0, _slicedToArray2['default'])(_transformation, 2),
        _x = _transformation2[0],
        _y = _transformation2[1];

      var idx = (width * y + x) << 2;

      var _idx = (_width * _y + _x) << 2;

      var pixel = _data.readUInt32BE(_idx);

      data.writeUInt32BE(pixel, idx);
    }
  }

  img.bitmap.data = data;
  img.bitmap.width = width;
  img.bitmap.height = height;
}
/*
 * Automagically rotates an image based on its EXIF data (if present).
 * @param img {Jimp} a Jimp image object
 */

function exifRotate(img) {
  if (getExifOrientation(img) < 2) return;
  var transformation = getExifOrientationTransformation(img);
  var swapDimensions = getExifOrientation(img) > 4;
  var newWidth = swapDimensions ? img.bitmap.height : img.bitmap.width;
  var newHeight = swapDimensions ? img.bitmap.width : img.bitmap.height;
  transformBitmap(img, newWidth, newHeight, transformation);
} // parses a bitmap from the constructor to the JIMP bitmap property

function parseBitmap(data, path, cb) {
  var _this = this;

  getMIMEFromBuffer(data, path).then(
    function(mime) {
      if (typeof mime !== 'string') {
        return cb(new Error('Could not find MIME for Buffer <' + path + '>'));
      }

      _this._originalMime = mime.toLowerCase();

      try {
        var _mime = _this.getMIME();

        if (_this.constructor.decoders[_mime]) {
          _this.bitmap = _this.constructor.decoders[_mime](data);
        } else {
          return _utils.throwError.call(
            _this,
            'Unsupported MIME type: ' + _mime,
            cb
          );
        }
      } catch (error) {
        return cb.call(_this, error, _this);
      }

      try {
        _this._exif = _exifParser['default'].create(data).parse();
        exifRotate(_this); // EXIF data
      } catch (error) {
        /* meh */
      }

      cb.call(_this, null, _this);
      return _this;
    },
    function(error) {
      cb(
        new Error(
          'Could not find MIME for Buffer <' + path + '> ' + error.message
        )
      );
    }
  );
}

function compositeBitmapOverBackground(Jimp, image) {
  return new Jimp(
    image.bitmap.width,
    image.bitmap.height,
    image._background
  ).composite(image, 0, 0).bitmap;
}
/**
 * Converts the image to a buffer
 * @param {string} mime the mime type of the image buffer to be created
 * @param {function(Error, Jimp)} cb a Node-style function to call with the buffer as the second argument
 * @returns {Jimp} this for chaining of methods
 */

function getBuffer(mime, cb) {
  if (mime === constants.AUTO) {
    // allow auto MIME detection
    mime = this.getMIME();
  }

  if (typeof mime !== 'string') {
    return _utils.throwError.call(this, 'mime must be a string', cb);
  }

  if (typeof cb !== 'function') {
    return _utils.throwError.call(this, 'cb must be a function', cb);
  }

  mime = mime.toLowerCase();

  if (this._rgba && this.constructor.hasAlpha[mime]) {
    this.bitmap.data = Buffer.from(this.bitmap.data);
  } else {
    // when format doesn't support alpha
    // composite onto a new image so that the background shows through alpha channels
    this.bitmap.data = compositeBitmapOverBackground(
      this.constructor,
      this
    ).data;
  }

  if (this.constructor.encoders[mime]) {
    var buffer = this.constructor.encoders[mime](this);
    cb.call(this, null, buffer);
  } else {
    cb.call(this, 'Unsupported MIME type: ' + mime);
  }

  return this;
}

function getBufferAsync(mime) {
  return (0, _promisify['default'])(getBuffer, this, mime);
}
//# sourceMappingURL=image-bitmap.js.map
