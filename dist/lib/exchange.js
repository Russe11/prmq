'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var Exchange = function () {
  function Exchange(channel, exchangeName, type, options) {
    _classCallCheck(this, Exchange);

    this._ch = channel;
    this._exchangeName = exchangeName;
    this._options = options;
    this._type = type;
    this._sends = [];
  }

  _createClass(Exchange, [{
    key: 'exec',
    value: async function exec() {
      var _this = this;

      if (this._shouldAssert) {
        await this._ch.assertExchange(this._exchangeName, this._type, this._options);
        this._shouldAssert = false;
      }

      this._sends.forEach(async function (s) {

        var msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);

        if (!s.routingKey) {
          await _this._ch.publish(_this._exchangeName, '', Buffer.from(msg));
        } else {
          await _this._ch.publish(_this._exchangeName, s.routingKey, Buffer.from(msg));
        }
      });
      this._sends = [];
      return this;
    }
  }, {
    key: 'assert',
    value: function assert() {
      this._shouldAssert = this;
      return this;
    }

    /**
     * Delete Exchange
     * @returns {{exchange, ifUnused, ticket, nowait}|<Replies.Empty>|void}
     */

  }, {
    key: 'delete',
    value: function _delete() {
      return this._ch.deleteExchange(this._exchangeName);
    }
  }, {
    key: 'publish',
    value: function publish(message) {
      this._sends.push({ message: message });
      return this;
    }
  }, {
    key: 'publishAndExec',
    value: function publishAndExec(message) {
      this._sends.push({ message: message });
      return this.exec();
    }
  }, {
    key: 'publishWithRoute',
    value: function publishWithRoute(message, routingKey) {
      this._sends.push({ message: message, routingKey: routingKey });
      return this;
    }
  }, {
    key: 'publishWithRouteAndExec',
    value: function publishWithRouteAndExec(message, routingKey) {
      this._sends.push({ message: message, routingKey: routingKey });
      return this.exec();
    }
  }, {
    key: 'publishWithKey',
    value: function publishWithKey(message, routingKey) {
      this._sends.push({ message: message, routingKey: routingKey });
      return this;
    }
  }, {
    key: 'publishWithKeyAndExec',
    value: function publishWithKeyAndExec(message, routingKey) {
      this._sends.push({ message: message, routingKey: routingKey });
      return this.exec();
    }
  }]);

  return Exchange;
}();

module.exports = Exchange;