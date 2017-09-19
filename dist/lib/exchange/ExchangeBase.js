"use strict";
// Copyright (c) 2017 Russell Lewis (russlewis@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var ExchangeTypes;
(function (ExchangeTypes) {
    ExchangeTypes["Fanout"] = "fanout";
    ExchangeTypes["Direct"] = "direct";
    ExchangeTypes["Topic"] = "topic";
})(ExchangeTypes = exports.ExchangeTypes || (exports.ExchangeTypes = {}));
var ExchangeBase = /** @class */ (function () {
    function ExchangeBase(channel, exchangeName, exchangeType, options) {
        this.channel = channel;
        this.exchangeName = exchangeName;
        this.exchangeType = exchangeType;
        this.options = options;
        this.shouldAssert = false;
    }
    ExchangeBase.prototype.execAssert = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.shouldAssert) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.channel.assertExchange(this.exchangeName, this.exchangeType, this.options)];
                    case 1:
                        _a.sent();
                        this.shouldAssert = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(ExchangeBase.prototype, "ExchangeName", {
        get: function () {
            return this.exchangeName;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Assert an exchange - Channel#assertExchange
     */
    ExchangeBase.prototype.assert = function () {
        this.shouldAssert = true;
        return this;
    };
    /**
     * Get the name of the exchange
     */
    ExchangeBase.prototype.getName = function () {
        return this.exchangeName;
    };
    /**
     * Is exchange of type = fanout
     */
    ExchangeBase.prototype.isFanoutExchange = function () {
        return this.exchangeType === ExchangeTypes.Fanout;
    };
    /**
     * Is exchange of type = direct
     */
    ExchangeBase.prototype.isDirectExchange = function () {
        return this.exchangeType === ExchangeTypes.Direct;
    };
    /**
     * Is exchange of type = topic
     * @returns {boolean}
     */
    ExchangeBase.prototype.isTopicExchange = function () {
        return this.exchangeType === ExchangeTypes.Topic;
    };
    Object.defineProperty(ExchangeBase.prototype, "durable", {
        /**
         * Exchange was created with option { durable: true }
         */
        get: function () {
            return this.options && this.options.durable === true;
        },
        enumerable: true,
        configurable: true
    });
    /**
   * Delete Exchange
   */
    ExchangeBase.prototype.deleteExchange = function () {
        return this.channel.deleteExchange(this.exchangeType);
    };
    return ExchangeBase;
}());
exports.ExchangeBase = ExchangeBase;
