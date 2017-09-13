'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

require('babel-polyfill');
var ConsumeThen = require('./consumeThen');

var Queue = function () {
  function Queue(ch, queueName, options) {
    _classCallCheck(this, Queue);

    this._ch = ch;
    this._queueName = queueName;
    this._options = options;
    this._shouldAssert = false;
    this._sends = [];
    this._consumers = [];
    this._binds = [];
  }

  /**
   * Send options
   * @typedef {Object} SendQueueOptions
   * @property {string} expiration
   * @property {string} userId
   * @property {string|string[]} CC
   * @property {number} priority
   * @property {boolean} persistent
   * @property {boolean|number} deliveryMode
   */

  /**
   * Execute all actions currently pending on the queue
   * @returns {Promise.<Queue>}
   */


  _createClass(Queue, [{
    key: 'exec',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._shouldAssert) {
                  _context3.next = 4;
                  break;
                }

                _context3.next = 3;
                return this._ch.assertQueue(this._queueName, this._options);

              case 3:
                this._q = _context3.sent;

              case 4:

                this._binds.forEach(function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(b) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _this._ch.bindQueue(_this._q.queue, b.exchangeName, b.routing);

                          case 2:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this);
                  }));

                  return function (_x) {
                    return _ref2.apply(this, arguments);
                  };
                }());

                this._consumers.forEach(function (c) {
                  if (c.noAck === true && c.raw === false) {
                    _this._consume(c.cb);
                  } else if (c.noAck === false && c.raw === false) {
                    _this._consumeWithAck(c.cb);
                  } else if (c.noAck === true && c.raw === true) {
                    _this._consumeRaw(c.cb);
                  } else if (c.noAck === false && c.raw === true) {
                    _this._consumeRawWithAck(c.cb);
                  }
                });

                this._sends.forEach(function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(s) {
                    var msg;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
                            _context2.next = 3;
                            return _this._ch.sendToQueue(_this._q.queue, Buffer.from(msg), s.options);

                          case 3:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }());

                return _context3.abrupt('return', this);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function exec() {
        return _ref.apply(this, arguments);
      }

      return exec;
    }()
  }, {
    key: 'getName',
    value: function getName() {
      return this._queueName;
    }

    /**
     * Queue was created with option { durable: true }
     * @returns {*|boolean}
     */

  }, {
    key: 'isDurable',
    value: function isDurable() {
      return this._options && this._options.durable === true;
    }

    /**
     * Check if a queue exists
     * @returns {Promise.<void>}
     */

  }, {
    key: 'check',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._ch.checkQueue(this._queueName);

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function check() {
        return _ref4.apply(this, arguments);
      }

      return check;
    }()

    /**
     * Assert a queue - Channel#assertQueue
     * @returns {Queue}
     */

  }, {
    key: 'assert',
    value: function assert() {
      this._shouldAssert = true;
      return this;
    }

    /**
     * Send a message to a queue
     * @param {string|object} message
     * @param {SendQueueOptions} options
     * @returns {Queue}
     */

  }, {
    key: 'send',
    value: function send(message) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._send(message, options);
      return this;
    }
  }, {
    key: '_send',
    value: function _send(message, options) {
      this._sends.push({ message: message, options: options });
    }
  }, {
    key: 'bind',
    value: function bind(exchange, routing) {
      this._binds.push({ exchangeName: exchange._exchangeName, routing: routing });
      return this;
    }

    /**
     * @param {Exchange} exchange
     * @param {string} routing
     */

  }, {
    key: 'bindWithRouting',
    value: function bindWithRouting(exchange, routing) {
      this._binds.push({ exchangeName: exchange._exchangeName, routing: routing });
      return this;
    }
  }, {
    key: 'bindWithRoutings',
    value: function bindWithRoutings(exchange, routings) {
      var _this2 = this;

      routings.forEach(function (routing) {
        _this2._binds.push({ exchangeName: exchange._exchangeName, routing: routing });
      });
      return this;
    }
  }, {
    key: 'consume',
    value: function consume(cb) {
      this._consumers.push({ noAck: true, raw: false, cb: cb });
      return this;
    }
  }, {
    key: 'consumeRaw',
    value: function consumeRaw(cb) {
      this._consumers.push({ noAck: true, raw: true, cb: cb });
      return this;
    }
  }, {
    key: 'consumeWithAck',
    value: function consumeWithAck(cb) {
      this._consumers.push({ noAck: false, raw: false, cb: cb });
      return this;
    }

    /**
     * Consume
     * @param cb
     * @returns {Queue}
     */

  }, {
    key: 'consumeRawWithAck',
    value: function consumeRawWithAck(cb) {
      this._consumers.push({ noAck: false, raw: true, cb: cb });
      return this;
    }

    /**
     * Channel Prefetch - channel#prefetch
     * @param count
     * @returns {Queue}
     */

  }, {
    key: 'prefetch',
    value: function prefetch(count) {
      this._ch.prefetch(count);
      return this;
    }

    /**
     * @returns {Queue}
     * @private
     */

  }, {
    key: '_consume',
    value: function _consume(cb) {
      this._ch.consume(this._q.queue, function (msg) {
        if (msg !== null) {
          var content = msg.content.toString();
          cb(content.startsWith('{') ? JSON.parse(content) : content);
        }
      }, { noAck: true });
      return this;
    }

    /**
     * @param cb
     * @private
     */

  }, {
    key: '_consumeWithAck',
    value: function _consumeWithAck(cb) {
      var _this3 = this;

      this._ch.consume(this._q.queue, function (msg) {
        if (msg !== null) {
          var content = msg.content.toString();
          cb(content.startsWith('{') ? JSON.parse(content) : content, new ConsumeThen(_this3._ch, msg));
        }
      }, { noAck: false });
    }

    /**
     * @param cb
     * @returns {Queue}
     * @private
     */

  }, {
    key: '_consumeRaw',
    value: function _consumeRaw(cb) {
      var _this4 = this;

      this._ch.consume(this._q.queue, function (msg) {
        return cb(msg, function () {
          _this4._ch.ack(msg);
        });
      }, { noAck: true });
      return this;
    }

    /**
     * @param cb
     * @returns {Queue}
     * @private
     */

  }, {
    key: '_consumeRawWithAck',
    value: function _consumeRawWithAck(cb) {
      var _this5 = this;

      this._ch.consume(this._q.queue, function (msg) {
        return cb(msg, function () {
          _this5._ch.ack(msg);
        });
      }, { noAck: false });
      return this;
    }
  }]);

  return Queue;
}();

module.exports = Queue;