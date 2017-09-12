'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

class Exchange {
  constructor(channel, exchangeName, type, options) {
    this._ch = channel;
    this._exchangeName = exchangeName;
    this._options = options;
    this._type = type;
    this._sends = [];
  }

  exec() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this._shouldAssert) {
        yield _this._ch.assertExchange(_this._exchangeName, _this._type, _this._options);
        _this._shouldAssert = false;
      }

      _this._sends.forEach((() => {
        var _ref = _asyncToGenerator(function* (s) {

          let msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);

          if (!s.routingKey) {
            yield _this._ch.publish(_this._exchangeName, '', Buffer.from(msg));
          } else {
            yield _this._ch.publish(_this._exchangeName, s.routingKey, Buffer.from(msg));
          }
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());
      _this._sends = [];
      return _this;
    })();
  }

  assert() {
    this._shouldAssert = this;
    return this;
  }

  /**
   * Delete Exchange
   * @returns {{exchange, ifUnused, ticket, nowait}|<Replies.Empty>|void}
   */
  delete() {
    return this._ch.deleteExchange(this._exchangeName);
  }

  publish(message) {
    this._sends.push({ message });
    return this;
  }

  publishAndExec(message) {
    this._sends.push({ message });
    return this.exec();
  }

  publishWithRoute(message, routingKey) {
    this._sends.push({ message, routingKey });
    return this;
  }

  publishWithRouteAndExec(message, routingKey) {
    this._sends.push({ message, routingKey });
    return this.exec();
  }

  publishWithKey(message, routingKey) {
    this._sends.push({ message, routingKey });
    return this;
  }

  publishWithKeyAndExec(message, routingKey) {
    this._sends.push({ message, routingKey });
    return this.exec();
  }
}

module.exports = Exchange;