'use strict';

require('babel-polyfill');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-unused-vars,no-console,import/no-extraneous-dependencies,padded-blocks */
var P = require('bluebird');

var _require = require('chai'),
    expect = _require.expect;

var PRMQ = require('./index');


var prmq = new PRMQ('amqp://localhost');

describe('Examples', function () {

  beforeEach(function () {
    return P.join(prmq.deleteExchangesAndQueues(['test_exchange', 'logs', 'topic', 'direct_logs'], ['test_queue', 'task_queue', 'logs', 'hello']));
  });

  it('HelloWorld', function (done) {
    prmq.channel().then(function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ch) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return ch.queue('hello').consume(function (msg) {
                  expect(msg).eq('Hello World!');
                  done();
                }).sendAndExec('Hello World!');

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  });

  it('Worker', function (done) {
    prmq.channel(1).then(function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ch) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return ch.queue('task_queue').consumeWithAck(function (msg, then) {
                  setTimeout(function () {
                    expect(msg).to.eq('Hello World!');
                    then.ack();
                    done();
                  });
                }).sendPersistent('Hello World!').exec();

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  });

  it('PubSub', function (done) {

    prmq.channel().then(function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ch) {
        var ex;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return ch.exchangeFanout('logs').exec();

              case 2:
                ex = _context3.sent;
                _context3.next = 5;
                return ch.queue('').bind(ex).consume(function (msg) {
                  expect(msg).to.eq('Hello World');
                  done();
                }).exec();

              case 5:
                _context3.next = 7;
                return ex.publish('Hello World').exec();

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());
  });

  it('Routing', function (done) {
    var msg = 'Hello World!';
    var severity = 'info';
    prmq.channel().then(function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ch) {
        var ex;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return ch.exchangeDirect('logs').exec();

              case 2:
                ex = _context4.sent;
                _context4.next = 5;
                return ch.queueExclusive('').bindWithRoutings(ex, ['info', 'warning', 'error']).consumeRaw(function (msg) {
                  console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                  done();
                }).exec();

              case 5:
                _context4.next = 7;
                return ex.publishWithRouteAndExec(msg, severity);

              case 7:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());
  });

  it('Topics', function (done) {

    prmq.channel().then(function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ch) {
        var ex;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return ch.exchangeTopic('topic', { durable: false }).exec();

              case 2:
                ex = _context5.sent;
                _context5.next = 5;
                return ch.queueExclusive('').bindWithRouting(ex, 'kern.*').consumeRaw(function (msg) {
                  expect(msg.fields.routingKey).to.equal('kern.critical');
                  expect(msg.content.toString().toString()).to.equal('A critical kernel error');
                  done();
                }).exec();

              case 5:
                _context5.next = 7;
                return ex.publishWithKeyAndExec('A critical kernel error', 'kern.critical');

              case 7:
                return _context5.abrupt('return', _context5.sent);

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      }));

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }());
  });
});