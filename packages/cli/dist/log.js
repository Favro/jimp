"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logResult = exports.log = exports.greenCheck = void 0;
var logSymbols = __importStar(require("log-symbols"));
var chalk_1 = __importDefault(require("chalk"));
exports.greenCheck = chalk_1.default.green(logSymbols.success + " ");
exports.log = function (message, verbose) {
    if (verbose === void 0) { verbose = false; }
    return verbose && console.log(message);
};
exports.logResult = function (functionName, result) {
    return exports.log(exports.greenCheck + "  Result of running '" + functionName + "': " + JSON.stringify(result), true);
};
