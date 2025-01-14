#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImage = exports.manipulateImage = void 0;
var jimp_1 = __importDefault(require("jimp"));
var log_1 = require("./log");
var load_font_1 = require("./load-font");
function runAction(image, verbose, loadedFont, _a) {
    var action = _a[0], args = _a.slice(1);
    return __awaiter(this, void 0, void 0, function () {
        var argsString, parsedArgs, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    argsString = args.length ? " with args: [ " + args.join(', ') + " ]" : '';
                    log_1.log("\uFE0F\uD83D\uDD8D\uFE0F  Applying " + action + argsString, verbose);
                    parsedArgs = args.map(function (arg) {
                        try {
                            return JSON.parse(arg);
                        }
                        catch (error) {
                            return arg;
                        }
                    });
                    if (action === 'print') {
                        parsedArgs.unshift(loadedFont);
                    }
                    if (!(action === 'composite' || action === 'blit' || action === 'mask')) return [3 /*break*/, 2];
                    _b = parsedArgs;
                    _c = 0;
                    return [4 /*yield*/, jimp_1.default.read(parsedArgs[0])];
                case 1:
                    _b[_c] = _d.sent();
                    _d.label = 2;
                case 2:
                    image[action].apply(image, parsedArgs);
                    return [2 /*return*/];
            }
        });
    });
}
function runActions(image, loadedFont, _a) {
    var actions = _a.actions, verbose = _a.verbose;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!actions) return [3 /*break*/, 4];
                    if (!Array.isArray(actions[0])) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all(actions.map(function (action) {
                            return runAction(image, verbose, loadedFont, action);
                        }))];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, runAction(image, verbose, loadedFont, actions)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function processImage(image, font, actions, output, verbose) {
    return __awaiter(this, void 0, void 0, function () {
        var loadedFont;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, load_font_1.loadFont(font, verbose)];
                case 1:
                    loadedFont = _a.sent();
                    return [4 /*yield*/, runActions(image, loadedFont, { actions: actions, verbose: verbose })];
                case 2:
                    _a.sent();
                    if (!output) return [3 /*break*/, 4];
                    return [4 /*yield*/, image.writeAsync(output)];
                case 3:
                    _a.sent();
                    log_1.log(" " + log_1.greenCheck + "\uFE0F Image successfully written to: " + output, verbose);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function manipulateImage(_a) {
    var img = _a.img, output = _a.output, actions = _a.actions, verbose = _a.verbose, font = _a.loadFont;
    return __awaiter(this, void 0, void 0, function () {
        var image;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_1.log(" \uD83D\uDCF7  Loading source image: " + img + " ...", verbose);
                    return [4 /*yield*/, jimp_1.default.read(img)];
                case 1:
                    image = _b.sent();
                    return [4 /*yield*/, processImage(image, font, actions, output, verbose)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.manipulateImage = manipulateImage;
function createImage(_a) {
    var width = _a.width, height = _a.height, background = _a.background, output = _a.output, actions = _a.actions, verbose = _a.verbose, font = _a.loadFont;
    return __awaiter(this, void 0, void 0, function () {
        var backgroundString, image;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    backgroundString = background ? " with background " + background : '';
                    log_1.log(" \uD83D\uDCF7  Creating image: [" + width + " " + height + "]" + backgroundString, verbose);
                    if (!background) return [3 /*break*/, 2];
                    return [4 /*yield*/, jimp_1.default.create(width, height, background)];
                case 1:
                    image = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, jimp_1.default.create(width, height)];
                case 3:
                    image = _b.sent();
                    _b.label = 4;
                case 4: return [4 /*yield*/, processImage(image, font, actions, output, verbose)];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.createImage = createImage;
