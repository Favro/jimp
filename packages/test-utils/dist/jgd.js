"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/*
JGD - JS Graphic Description
This is a simple pixel based image representation, focused on simplify
testing through the possibility of a code friendly image definition in
javascript notation. This can also helps Jimp users to add icons and other
simple images in their script code.

Basically, JGD is a js object width `width`, `height` and `data`, where `data`
is an array of integers, each representing a RGBA pixel. This is simpler then
write a Buffer and we can use variables to make some "visual image code", like
a XPM code.

function donutJGD() {
    //Pallet  RRGGBBAA
    const _ = 0xFFFFFF00,
        i = 0xFF880088,
        X = 0xFF8800FF;
    return {
        width: 10, height: 10,
        data: [
            _,_,_,_,_,_,_,_,_,_,
            _,_,_,i,X,X,i,_,_,_,
            _,_,X,X,X,X,X,X,_,_,
            _,i,X,X,i,i,X,X,i,_,
            _,X,X,i,_,_,i,X,X,_,
            _,X,X,i,_,_,i,X,X,_,
            _,i,X,X,i,i,X,X,i,_,
            _,_,X,X,X,X,X,X,_,_,
            _,_,_,i,X,X,i,_,_,_,
            _,_,_,_,_,_,_,_,_,_
        ]
    };
}

new Jimp(donutJGD(), function (err, image) {
    this.write("/tmp/donut.png");
});
*/
function decode(jgd) {
  var bitmap = {
    width: jgd.width,
    height: jgd.height
  };
  var length = jgd.width * jgd.height;
  bitmap.data = Buffer.alloc(length * 4);

  for (var i = 0; i < length; i++) {
    bitmap.data.writeUInt32BE(jgd.data[i], i * 4);
  }

  return bitmap;
}

function encode(bitmap) {
  var jgd = {
    width: bitmap.width,
    height: bitmap.height,
    data: []
  };

  for (var row = 0; row < bitmap.height; row++) {
    for (var col = 0; col < bitmap.width; col++) {
      var i = bitmap.width * row + col << 2;
      var r = bitmap.data[i + 0];
      var g = bitmap.data[i + 1];
      var b = bitmap.data[i + 2];
      var a = bitmap.data[i + 3];
      var color = ((r & 0xff) << 24 >>> 0 | (g & 0xff) << 16 | (b & 0xff) << 8 | a & 0xff) >>> 0;
      jgd.data.push(color);
    }
  }

  return jgd;
}

var _default = {
  encode: encode,
  decode: decode
};
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=jgd.js.map