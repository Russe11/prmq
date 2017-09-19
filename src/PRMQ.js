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
/**
 * PRMQ Library
 */
var amqp = require("amqplib");
var P = require("bluebird");
var ChannelConf_1 = require("./channel/ChannelConf");
exports.ChannelConf = ChannelConf_1.ChannelConf;
var ChannelNConf_1 = require("./channel/ChannelNConf");
exports.ChannelNConf = ChannelNConf_1.ChannelNConf;
var ExchangeConf_1 = require("./exchange/ExchangeConf");
exports.ExchangeConf = ExchangeConf_1.ExchangeConf;
var ExchangeNConf_1 = require("./exchange/ExchangeNConf");
exports.ExchangeNConf = ExchangeNConf_1.ExchangeNConf;
var QueueConf_1 = require("./queue/QueueConf");
exports.QueueConf = QueueConf_1.QueueConf;
var QueueNConf_1 = require("./queue/QueueNConf");
exports.QueueNConf = QueueNConf_1.QueueNConf;
var ConsumeThen_1 = require("./helpers/ConsumeThen");
exports.ConsumeThen = ConsumeThen_1.ConsumeThen;
var debug = require('debug')('http');
var PRMQ = /** @class */ (function () {
    function PRMQ(connectionString) {
        this.connectionString = connectionString;
    }
    /**
     * Create a RabbitMQ channel
     * @param {number?} prefetch
     */
    PRMQ.prototype.channel = function (prefetch) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var conn, ch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.open) {
                            this.open = amqp.connect(this.connectionString);
                        }
                        return [4 /*yield*/, this.open];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.createChannel()];
                    case 2:
                        ch = _a.sent();
                        ch.on('error', function (err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        debug('Channel Error %o', err.message);
                                        return [4 /*yield*/, conn.createChannel()];
                                    case 1:
                                        ch = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        if (!prefetch) return [3 /*break*/, 4];
                        return [4 /*yield*/, ch.prefetch(prefetch)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, new ChannelNConf_1.ChannelNConf(ch)];
                }
            });
        });
    };
    PRMQ.prototype.confirmChannel = function (prefetch) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var conn, ch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.open) {
                            this.open = amqp.connect(this.connectionString);
                        }
                        return [4 /*yield*/, this.open];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.createConfirmChannel()];
                    case 2:
                        ch = _a.sent();
                        ch.on('error', function (err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        debug('Channel Error %o', err.message);
                                        return [4 /*yield*/, conn.createConfirmChannel()];
                                    case 1:
                                        ch = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        if (!prefetch) return [3 /*break*/, 4];
                        return [4 /*yield*/, ch.prefetch(prefetch)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, new ChannelConf_1.ChannelConf(ch)];
                }
            });
        });
    };
    /**
     * Remove exchange and queues from RabbitMQ
     * @param {string[]} exchanges
     * @param {string[]?} queues
     */
    PRMQ.prototype.deleteExchangesAndQueues = function (exchanges, queues) {
        if (queues === void 0) { queues = []; }
        if (!this.open) {
            this.open = amqp.connect(this.connectionString);
        }
        return this.open
            .then(function (conn) { return conn.createChannel(); })
            .then(function (ch) {
            return P.map(queues, function (queue) { return ch.deleteQueue(queue); })
                .then(function () { return P.map(exchanges, function (exchange) { return ch.deleteExchange(exchange); }); });
        });
    };
    return PRMQ;
}());
exports.PRMQ = PRMQ;
