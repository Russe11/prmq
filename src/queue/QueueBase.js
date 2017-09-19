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
 * PRMQ Queues
 */
var ConsumeThen_1 = require("../helpers/ConsumeThen");
var QueueBase = /** @class */ (function () {
    function QueueBase(ch, queueName, options) {
        this.ch = ch;
        this.queueName = queueName;
        this.options = options;
        this.shouldAssert = false;
        this.consumers = [];
        this.binds = [];
    }
    QueueBase.prototype.execAssert = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.shouldAssert) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.ch.assertQueue(this.queueName, this.options)];
                    case 1:
                        _a.q = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    QueueBase.prototype.execBinds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.binds.forEach(function (b) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.ch.bindQueue(this.q.queue, b.exchangeName, b.routing)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    QueueBase.prototype.execConsumers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.consumers.forEach(function (c) {
                    if (c.noAck === true && c.raw === false) {
                        _this.execConsume(c.callbackFn);
                    }
                    else if (c.noAck === false && c.raw === false) {
                        _this.execConsumeWithAck(c.callbackFn);
                    }
                    else if (c.noAck === true && c.raw === true) {
                        _this.execConsumeRaw(c.callbackFn);
                    }
                    else if (c.noAck === false && c.raw === true) {
                        _this.execConsumeRawWithAck(c.callbackFn);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    QueueBase.prototype.getQueueName = function () {
        return this.queueName;
    };
    /**
     * Queue was created with option { durable: true }
     */
    QueueBase.prototype.isDurable = function () {
        return this.options && this.options.durable === true;
    };
    /**
     * Check if a queue exists
     */
    QueueBase.prototype.check = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ch.checkQueue(this.queueName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Assert a queue - Channel#assertQueue
     */
    QueueBase.prototype.assert = function () {
        this.shouldAssert = true;
        return this;
    };
    QueueBase.prototype.bind = function (exchange) {
        this.binds.push({ exchangeName: exchange.ExchangeName });
        return this;
    };
    QueueBase.prototype.bindWithRouting = function (exchange, routing) {
        this.binds.push({ exchangeName: exchange.ExchangeName, routing: routing });
        return this;
    };
    QueueBase.prototype.bindWithRoutings = function (exchange, routings) {
        var _this = this;
        routings.forEach(function (routing) {
            _this.binds.push({ exchangeName: exchange.ExchangeName, routing: routing });
        });
        return this;
    };
    QueueBase.prototype.consume = function (callbackFn) {
        this.consumers.push({ noAck: true, raw: false, callbackFn: callbackFn });
        return this;
    };
    QueueBase.prototype.consumeRaw = function (callbackFn) {
        this.consumers.push({ noAck: true, raw: true, callbackFn: callbackFn });
        return this;
    };
    QueueBase.prototype.consumeWithAck = function (callbackFn) {
        this.consumers.push({ noAck: false, raw: false, callbackFn: callbackFn });
        return this;
    };
    QueueBase.prototype.consumeRawWithAck = function (callbackFn) {
        this.consumers.push({ noAck: false, raw: true, callbackFn: callbackFn });
        return this;
    };
    /**
     * Channel Prefetch - channel#prefetch
     */
    QueueBase.prototype.prefetch = function (count) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ch.prefetch(count)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     */
    QueueBase.prototype.execConsume = function (callbackFn) {
        this.ch.consume(this.q.queue, function (msg) {
            if (msg !== null) {
                var content = msg.content.toString();
                callbackFn(content.startsWith('{') ? JSON.parse(content) : content);
            }
        }, { noAck: true });
        return this;
    };
    QueueBase.prototype.execConsumeWithAck = function (callbackFn) {
        var _this = this;
        this.ch.consume(this.q.queue, function (msg) {
            if (msg !== null) {
                var content = msg.content.toString();
                callbackFn(content.startsWith('{') ? JSON.parse(content) : content, new ConsumeThen_1.ConsumeThen(_this.ch, msg));
            }
        }, { noAck: false });
    };
    QueueBase.prototype.execConsumeRaw = function (callbackFn) {
        var _this = this;
        this.ch.consume(this.q.queue, function (msg) { return callbackFn(msg, function () {
            _this.ch.ack(msg);
        }); }, { noAck: true });
        return this;
    };
    QueueBase.prototype.execConsumeRawWithAck = function (callbackFn) {
        var _this = this;
        this.ch.consume(this.q.queue, function (msg) { return callbackFn(msg, function () {
            _this.ch.ack(msg);
        }); }, { noAck: false });
        return this;
    };
    return QueueBase;
}());
exports.QueueBase = QueueBase;
