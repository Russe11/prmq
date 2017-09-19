"use strict";
/* eslint-disable no-unused-vars,no-console,import/no-extraneous-dependencies,padded-blocks */
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var P = require("bluebird");
var chai_1 = require("chai");
var PRMQ_1 = require("../lib/PRMQ");
var prmq;
describe('Examples', function () {
    before(function () {
        prmq = new PRMQ_1.PRMQ('amqp://localhost');
    });
    beforeEach(function () { return P.join(prmq.deleteExchangesAndQueues([
        'test_exchange',
        'logs',
        'topic',
        'direct_logs',
    ], [
        'test_queue',
        'task_queue',
        'logs',
        'hello',
    ])); });
    it('HelloWorld', function (done) {
        prmq.channel()
            .then(function (ch) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ch.queue('hello')
                            .consume(function (msg) {
                            chai_1.expect(msg).eq('Hello World!');
                            done();
                        })
                            .send('Hello World!')
                            .exec()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Worker', function (done) {
        prmq.channel(1)
            .then(function (ch) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ch.queue('task_queue')
                            .consumeWithAck(function (msg, then) {
                            setTimeout(function () {
                                chai_1.expect(msg).to.eq('Hello World!');
                                then.ack();
                                done();
                            }, 100);
                        })
                            .send('Hello World!', { persistent: true })
                            .exec()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('PubSub', function (done) {
        prmq.channel()
            .then(function (ch) { return __awaiter(_this, void 0, void 0, function () {
            var ex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ch.exchangeFanout('logs').exec()];
                    case 1:
                        ex = _a.sent();
                        return [4 /*yield*/, ch.queue('')
                                .bind(ex)
                                .consume(function (msg) {
                                chai_1.expect(msg).to.eq('Hello World');
                                done();
                            })
                                .exec()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ex.publish('Hello World').exec()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Routing', function (done) {
        var msg = 'Hello World!';
        var severity = 'info';
        prmq.channel()
            .then(function (ch) { return __awaiter(_this, void 0, void 0, function () {
            var ex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ch.exchangeDirect('logs').exec()];
                    case 1:
                        ex = _a.sent();
                        return [4 /*yield*/, ch.queue('', { exclusive: true })
                                .bindWithRoutings(ex, [
                                'info',
                                'warning',
                                'error',
                            ])
                                .consumeRaw(function (msg) {
                                chai_1.expect(msg.fields.routingKey).to.eq('info');
                                chai_1.expect(msg.content.toString()).to.eq('Hello World!');
                                done();
                            }).exec()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ex.publishWithRoutingKey(msg, severity)
                                .exec()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Topics', function (done) {
        prmq.channel()
            .then(function (ch) { return __awaiter(_this, void 0, void 0, function () {
            var ex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ch.exchangeTopic('topic', { durable: false }).exec()];
                    case 1:
                        ex = _a.sent();
                        return [4 /*yield*/, ch.queue('', { exclusive: true })
                                .bindWithRouting(ex, 'kern.*')
                                .consumeRaw(function (msg) {
                                chai_1.expect(msg.fields.routingKey).to.equal('kern.critical');
                                chai_1.expect(msg.content.toString().toString()).to.equal('A critical kernel error');
                                done();
                            }).exec()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ex.publishWithRoutingKey('A critical kernel error', 'kern.critical')
                                .exec()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        }); });
    });
});
