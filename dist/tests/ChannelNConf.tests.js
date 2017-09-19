"use strict";
/* eslint-disable no-unused-vars,no-console,import/no-extraneous-dependencies,padded-blocks,prefer-destructuring */
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
/**
 * PRMQChannel Tests
 */
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var PRMQ_1 = require("../lib/PRMQ");
chai.use(chaiAsPromised);
var expect = chai.expect;
var prmq;
describe('Channels', function () {
    before(function () {
        prmq = new PRMQ_1.PRMQ('amqp://localhost');
    });
    describe('queue()', function () {
        it('should setup a queue', function () {
            return prmq.channel()
                .then(function (ch) { return ch.queue('prmqTestQueue', { durable: true }); })
                .then(function (q) {
                expect(q.queueName).to.eq('prmqTestQueue');
                expect(q.isDurable()).to.eq(true);
            });
        });
        it('should queue up a assertion on a queue', function () {
            return prmq.channel()
                .then(function (ch) {
                var q = ch.queue('prmqTestQueue', { durable: true });
                expect(q.shouldAssert).to.eq(true);
            });
        });
        it('should create a queue on RabbitMQ server', function () { return __awaiter(_this, void 0, void 0, function () {
            var ch, q;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prmq.channel()];
                    case 1:
                        ch = _a.sent();
                        q = ch.queue('prmqTestQueue');
                        return [4 /*yield*/, q.exec()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, q.check()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, ch.deleteQueue('prmqTestQueue')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('exchangeFanout()', function () {
        it('should setup a exchange with type = fanout', function () {
            return prmq.channel()
                .then(function (ch) { return ch.exchangeFanout('prmqTestExchange'); })
                .then(function (ex) {
                expect(ex.getName()).to.equal('prmqTestExchange');
                expect(ex.isFanoutExchange()).to.eq(true);
            });
        });
    });
    describe('exchangeDirect()', function () {
        it('should setup a exchange with type = direct', function () {
            return prmq.channel()
                .then(function (ch) { return ch.exchangeDirect('prmqTestExchange'); })
                .then(function (ex) {
                expect(ex.getName()).to.equal('prmqTestExchange');
                expect(ex.isDirectExchange()).to.eq(true);
            });
        });
    });
    describe('exchangeTopic()', function () {
        it('should setup a exchange with type = topic', function () {
            return prmq.channel()
                .then(function (ch) { return ch.exchangeTopic('prmqTestExchange'); })
                .then(function (ex) {
                expect(ex.getName()).to.equal('prmqTestExchange');
                expect(ex.isTopicExchange()).to.eq(true);
            });
        });
    });
    describe('close()', function () {
        it('should close the channel', function () { return __awaiter(_this, void 0, void 0, function () {
            var ch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prmq.channel()];
                    case 1:
                        ch = _a.sent();
                        return [4 /*yield*/, ch.close()];
                    case 2:
                        _a.sent();
                        expect(ch.isClosed()).to.eq(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('checkQueue()', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var ch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prmq.channel()];
                    case 1:
                        ch = _a.sent();
                        return [2 /*return*/, ch.deleteQueues([
                                'prmqCheckQueue'
                            ])];
                }
            });
        }); });
        it('should confirm a queue exists by Queue object', function () { return __awaiter(_this, void 0, void 0, function () {
            var ch, q;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prmq.channel()];
                    case 1:
                        ch = _a.sent();
                        return [4 /*yield*/, ch.queue('prmqCheckQueue')];
                    case 2:
                        q = _a.sent();
                        return [4 /*yield*/, q.exec()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, ch.checkQueue(q)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should confirm a queue exists by queue name', function () { return __awaiter(_this, void 0, void 0, function () {
            var ch, q;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prmq.channel()];
                    case 1:
                        ch = _a.sent();
                        return [4 /*yield*/, ch.queue('prmqCheckQueue')];
                    case 2:
                        q = _a.sent();
                        return [4 /*yield*/, q.exec()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, ch.checkQueue('prmqCheckQueue')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error when a Queue object does not exist', function () { return __awaiter(_this, void 0, void 0, function () {
            var ch, q;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prmq.channel()];
                    case 1:
                        ch = _a.sent();
                        return [4 /*yield*/, ch.queue('prmqCheckQueue')];
                    case 2:
                        q = _a.sent();
                        return [4 /*yield*/, q.exec()];
                    case 3:
                        _a.sent();
                        expect(ch.checkQueue('prmqQueueNotExist')).to.be.rejected;
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
