"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = exports.getExtension = exports.addType = void 0;
var mimeTypes = {};

var findType = function findType(extension) {
  return Object.entries(mimeTypes).find(function (type) {
    return type[1].includes(extension);
  }) || [];
};

var addType = function addType(mime, extensions) {
  mimeTypes[mime] = extensions;
};
/**
 * Lookup a mime type based on extension
 * @param {string} path path to find extension for
 * @returns {string} mime found mime type
 */


exports.addType = addType;

var getType = function getType(path) {
  var pathParts = path.split('/').slice(-1);
  var extension = pathParts[pathParts.length - 1].split('.').pop();
  var type = findType(extension);
  return type[0];
};
/**
 * Return file extension associated with a mime type
 * @param {string} type mime type to look up
 * @returns {string} extension file extension
 */


exports.getType = getType;

var getExtension = function getExtension(type) {
  return (mimeTypes[type.toLowerCase()] || [])[0];
};

exports.getExtension = getExtension;
//# sourceMappingURL=mime.js.map