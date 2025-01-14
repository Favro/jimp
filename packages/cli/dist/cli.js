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
var yargs_1 = __importDefault(require("yargs"));
var custom_1 = __importDefault(require("@jimp/custom"));
var jimp_1 = __importDefault(require("jimp"));
var log_1 = require("./log");
var load_font_1 = require("./load-font");
var omitFunctions = [
    'read',
    'create',
    'appendConstructorOption',
    'distance',
    'diff',
    'loadFont' // loaded as flag
];
var descriptions = {
    rgbaToInt: 'A static helper method that converts RGBA values to a single integer value. args: r, g, b, a (0 - 255)',
    intToRGBA: 'A static helper method that converts RGBA values to a single integer value. args: num (eg 0xFF0000FF)',
    cssColorToHex: ' Converts a css color (Hex, 8-digit (RGBA) Hex, RGB, RGBA, HSL, HSLA, HSV, HSVA, Named) to a hex number',
    limit255: 'Limits a number to between 0 or 255. args: num',
    compareHashes: ' Calculates the hamming distance of two images based on their perceptual hash. args: hash1, hash2',
    colorDiff: 'Compute color difference. args: color1, color2 ({r:val, g:val, b:val, a:val})',
    measureText: 'Measure how wide printing a string will be. args: text',
    measureTextHeight: 'Measure how tall printing a string will be. args: text, width'
};
function load(type, toLoad, verbose) {
    return toLoad.map(function (entry) {
        try {
            var result = require(entry);
            log_1.log(" \uD83D\uDD0C  Loaded " + type + ": " + entry, verbose);
            return result;
        }
        catch (error) {
            log_1.log("Couldn't load " + type + " [" + entry + "]. Make sure it's installed.", true);
        }
    });
}
function loadConfiguration(plugins, types, verbose) {
    if (!plugins.length && !types.length) {
        return;
    }
    log_1.log(" \uD83D\uDD04  Loading custom types/plugins into Jimp...", verbose);
    var loadedPlugins = load('plugin', plugins, verbose);
    var loadedTypes = load('type', types, verbose);
    custom_1.default({ types: loadedTypes, plugins: loadedPlugins }, jimp_1.default);
}
function getArgs(args, variations) {
    return args
        .map(function (arg, index) { return (variations.indexOf(arg) > -1 ? args[index + 1] : null); })
        .filter(Boolean);
}
function setUpCli(args, log) {
    var _this = this;
    if (log === void 0) { log = log_1.logResult; }
    // can't call argv before done setting up
    var verbose = !!args.find(function (arg) { return arg === '-v' || arg === '--verbose'; });
    var plugins = getArgs(args, ['--plugins', '-p']);
    var types = getArgs(args, ['--types', '-t']);
    loadConfiguration(plugins, types, verbose);
    var yargsConfig = yargs_1.default(args)
        .scriptName('jimp')
        .option('plugins', {
        alias: 'p',
        type: 'array',
        describe: 'Jimp plugins to load.'
    })
        .option('types', {
        alias: 't',
        type: 'array',
        describe: 'Jimp types to load.'
    })
        .option('verbose', {
        alias: 'v',
        type: 'boolean',
        describe: 'enable more logging'
    })
        .option('loadFont', {
        alias: 'f',
        type: 'string',
        describe: 'Path of font to load and be used in text operations'
    })
        .group(['plugins', 'types', 'loadFont'], 'Jimp Configuration:')
        .example('$0 read path/to/image.png --output output.jpg', 'Convert images from one type to another. See more under jimp read --help')
        .alias('font', 'loadFont')
        .demandCommand(1, 'You need at least one command before moving on')
        .command({
        command: 'read [img]',
        describe: 'Read and image into jimp. (PNG, JPEG, TIFF, BMP, or GIF)',
        builder: function (yargs) {
            return yargs
                .group(['output', 'actions'], 'Jimp Configuration:')
                .option('output', {
                alias: 'o',
                describe: 'file to output from jimp. (PNG, JPEG, TIFF, or BMP)'
            })
                .option('actions', {
                alias: 'a',
                type: 'array',
                describe: "actions (image manipulation) to run on the input image. Loaded functions " + Object.keys(jimp_1.default.prototype)
                    .sort()
                    .join(', ')
            })
                .example('$0 read path/to/image.png -a greyscale -a  resize 150 -1 --output output.jpg', 'Apply image manipulations functions')
                .example('$0 read path/to/image.png --loadFont FONT_SANS_8_WHITE -a yarnprint 0 0 "Some text" --output output.jpg', 'Use fonts')
                .example('$0 read path/to/image.png --plugins @jimp/plugin-circle -a circle --output output.jpg', 'Use plugins')
                .example('$0 read path/to/image.png -a blit /path/to/image.png 0 0 --output output.jpg', 'Use blit composite or mask');
        }
    })
        .command({
        command: 'create',
        describe: 'Create a new image',
        builder: function (yargs) {
            return yargs
                .group(['width', 'height', 'background'], 'New Image Configuration:')
                .group(['output', 'actions'], 'Jimp Configuration:')
                .demandOption(['width', 'height'], 'Please provide both height and width to create new image')
                .option('width', {
                alias: 'w',
                type: 'number',
                describe: 'Width of new image'
            })
                .option('height', {
                alias: 'he',
                type: 'number',
                describe: 'Height of new image'
            })
                .option('background', {
                alias: 'b',
                describe: 'Background color - either hex value or css string'
            })
                .option('output', {
                alias: 'o',
                describe: 'file to output from jimp. (PNG, JPEG, TIFF, or BMP)'
            })
                .option('actions', {
                alias: 'a',
                type: 'array',
                describe: "actions (image manipulation) to run on the input image. Loaded functions " + Object.keys(jimp_1.default.prototype)
                    .sort()
                    .join(', ')
            })
                .example('$0 create -w 100 -he 300 -o output.jpg', 'create a blank image')
                .example('$0 create -w 100 -he 300 -b 0xff0000ff -o output.jpg', 'create a red image')
                .example('$0 create -w 100 -he 300 -b "#FFJJED" -o output.jpg', 'create a css color image')
                .example('$0 create -w 100 -he 300 -b 0xff0000ff --loadFont FONT_SANS_8_WHITE -a print 0 0 "Some text" -o output.jpg', 'Run actions on the new image')
                .example('$0 create path/to/image.png -a blit /path/to/image.png 0 0 --output output.jpg', 'Use blit composite or mask');
        }
    })
        .command({
        command: 'distance [img1] [img2]',
        describe: 'Calculates the hamming distance of two images based on their perceptual hash',
        builder: function (yargs) {
            return yargs
                .example('$0 distance path/to/image.png path/to/another.png', '')
                .hide('version')
                .hide('font');
        },
        handler: function (_a) {
            var img1 = _a.img1, img2 = _a.img2;
            return __awaiter(_this, void 0, void 0, function () {
                var base, compare, distance;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, jimp_1.default.read(img1)];
                        case 1:
                            base = _b.sent();
                            return [4 /*yield*/, jimp_1.default.read(img2)];
                        case 2:
                            compare = _b.sent();
                            distance = jimp_1.default.distance(base, compare);
                            log('distance', distance);
                            return [2 /*return*/];
                    }
                });
            });
        }
    })
        .command({
        command: 'diff [img1] [img2]',
        describe: 'Diffs two images',
        builder: function (yargs) {
            return yargs
                .example('$0 diff [img1] [img2]', '-o')
                .option('outputDiff', {
                alias: 'o',
                describe: 'File to output diff to.'
            })
                .hide('version')
                .hide('font');
        },
        handler: function (_a) {
            var img1 = _a.img1, img2 = _a.img2, outputDiff = _a.outputDiff;
            return __awaiter(_this, void 0, void 0, function () {
                var base, compare, diff;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, jimp_1.default.read(img1)];
                        case 1:
                            base = _b.sent();
                            return [4 /*yield*/, jimp_1.default.read(img2)];
                        case 2:
                            compare = _b.sent();
                            diff = jimp_1.default.diff(base, compare);
                            log('diff', diff.percent);
                            if (outputDiff) {
                                diff.image.writeAsync(outputDiff === true ? 'diff.png' : outputDiff);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.keys(jimp_1.default).map(function (x) {
        if (omitFunctions.indexOf(x) > -1) {
            return;
        }
        var utilityFunction = jimp_1.default[x];
        if (typeof utilityFunction === 'function') {
            yargsConfig.command(x, descriptions[x], {}, function (_a) {
                var _ = _a._, font = _a.font, verbose = _a.verbose;
                return __awaiter(_this, void 0, void 0, function () {
                    var args, loadedFont, result;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                args = _.slice(1);
                                if (!(x === 'measureText' || x === 'measureTextHeight')) return [3 /*break*/, 2];
                                return [4 /*yield*/, load_font_1.loadFont(font, verbose)];
                            case 1:
                                loadedFont = _b.sent();
                                args.unshift(loadedFont);
                                _b.label = 2;
                            case 2:
                                result = utilityFunction.apply(void 0, args);
                                log(x, result);
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }
    });
    return yargsConfig;
}
exports.default = setUpCli;
