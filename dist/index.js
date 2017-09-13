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

var amqp = require('amqplib');
var P = require('bluebird');
var Channel = require('./lib/channel');

var PRMQ = function () {
  /**
   * @param {string} connectionString
   */
  function PRMQ(connectionString) {
    _classCallCheck(this, PRMQ);

    this._open = amqp.connect(connectionString);
  }

  /**
   * Create a RabbitMQ channel
   * @param {number?} prefetch
   */


  _createClass(PRMQ, [{
    key: 'channel',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(prefetch) {
        var conn, ch;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._open;

              case 2:
                conn = _context.sent;
                _context.next = 5;
                return conn.createChannel();

              case 5:
                ch = _context.sent;

                if (prefetch) {
                  ch.prefetch(prefetch);
                }
                return _context.abrupt('return', new Channel(ch));

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function channel(_x) {
        return _ref.apply(this, arguments);
      }

      return channel;
    }()

    /**
     * Remove exchange and queues from RabbitMQ
     * @param {string[]} exchanges
     * @param {string[]?} queues
     */

  }, {
    key: 'deleteExchangesAndQueues',
    value: function deleteExchangesAndQueues(exchanges) {
      var queues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return this._open.then(function (conn) {
        return conn.createChannel();
      }).then(function (ch) {
        return P.map(queues, function (queue) {
          return ch.deleteQueue(queue);
        }).then(function () {
          return P.map(exchanges, function (exchange) {
            return ch.deleteExchange(exchange);
          });
        });
      });
    }
  }]);

  return PRMQ;
}();

module.exports = PRMQ;