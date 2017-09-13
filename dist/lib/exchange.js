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

/**
 * Publish options
 * @typedef {Object} PublishOptions
 * @property {string} expiration
 * @property {string} userId
 * @property {string|string[]} CC
 * @property {number} priority
 * @property {boolean} persistent
 * @property {boolean|number} deliveryMode
 */

var Exchange = function () {
  function Exchange(channel, exchangeName, type, options) {
    _classCallCheck(this, Exchange);

    this._ch = channel;
    this._exchangeName = exchangeName;
    this._options = options;
    this._type = type;
    this._sends = [];
  }

  /**
   * Execute all actions currently pending on the exchange
   * @returns {Promise.<Exchange>}
   */


  _createClass(Exchange, [{
    key: 'exec',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this._shouldAssert) {
                  _context2.next = 4;
                  break;
                }

                _context2.next = 3;
                return this._ch.assertExchange(this._exchangeName, this._type, this._options);

              case 3:
                this._shouldAssert = false;

              case 4:

                this._sends.forEach(function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(s) {
                    var msg;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);

                            if (s.routingKey) {
                              _context.next = 6;
                              break;
                            }

                            _context.next = 4;
                            return _this._ch.publish(_this._exchangeName, '', Buffer.from(msg));

                          case 4:
                            _context.next = 8;
                            break;

                          case 6:
                            _context.next = 8;
                            return _this._ch.publish(_this._exchangeName, s.routingKey, Buffer.from(msg));

                          case 8:
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
                this._sends = [];
                return _context2.abrupt('return', this);

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function exec() {
        return _ref.apply(this, arguments);
      }

      return exec;
    }()

    /**
     * Assert an exchange - Channel#assertExchange
     * @returns {Exchange}
     */

  }, {
    key: 'assert',
    value: function assert() {
      this._shouldAssert = this;
      return this;
    }

    /**
     * Exchange was created with option { durable: true }
     * @returns {*|boolean}
     */

  }, {
    key: 'isDurable',
    value: function isDurable() {
      return this._options && this._options.durable === true;
    }
  }, {
    key: 'getName',
    value: function getName() {
      return this._exchangeName;
    }

    /**
     * Delete Exchange
     * @returns {{exchange, ifUnused, ticket, nowait}|<Replies.Empty>|void}
     */

  }, {
    key: 'deleteExchange',
    value: function deleteExchange() {
      return this._ch.deleteExchange(this._exchangeName);
    }

    /**
     * Public a message to an exchange - Channel#publish
     * @param {string|Object} message
     * @param {PublishOptions?} options
     * @returns {Exchange}
     */

  }, {
    key: 'publish',
    value: function publish(message, options) {
      this._sends.push({ message: message, options: options });
      return this;
    }

    /**
     * Publish a message to an exchange with a routing key - Channel#publish
     * @param {string|Object} message
     * @param {string} routingKey
     * @returns {Exchange}
     */

  }, {
    key: 'publishWithRoutingKey',
    value: function publishWithRoutingKey(message, routingKey) {
      this._sends.push({ message: message, routingKey: routingKey });
      return this;
    }
  }]);

  return Exchange;
}();

module.exports = Exchange;