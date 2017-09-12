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

var Queue = require('./queue');
var Exchange = require('./exchange');

var Channel = function () {
  function Channel(channel, exchangeName, type, options) {
    _classCallCheck(this, Channel);

    this._ch = channel;
  }

  _createClass(Channel, [{
    key: 'queue',
    value: function queue(queueName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: false, exclusive: false };

      return this._queue(queueName, options);
    }
  }, {
    key: 'queueExclusive',
    value: function queueExclusive(queueName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { exclusive: true };

      options.exclusive = options.exclusive || true;
      return this._queue(queueName, options);
    }
  }, {
    key: 'queueDurable',
    value: function queueDurable(queueName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: true };

      options.exclusive = options.exclusive || true;
      return this._queue(queueName, options);
    }
  }, {
    key: 'queueDurableExclusive',
    value: function queueDurableExclusive(queueName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: true, exclusive: true };

      options.exclusive = options.exclusive || true;
      options.durable = options.durable || true;
      return this._queue(queueName, options);
    }
  }, {
    key: 'exchangeDirect',
    value: function exchangeDirect(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: false };

      options.durable = options.durable || true;
      return this._exchange(exchangeName, 'direct', options);
    }
  }, {
    key: 'exchangeDirectDurable',
    value: function exchangeDirectDurable(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: true };

      return this._exchange(exchangeName, 'direct', options);
    }
  }, {
    key: 'exchangeFanout',
    value: function exchangeFanout(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: false };

      return this._exchange(exchangeName, 'fanout', options);
    }
  }, {
    key: 'exchangeFanoutDurable',
    value: function exchangeFanoutDurable(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: true };

      options.durable = options.durable || true;
      return this._exchange(exchangeName, 'fanout', options);
    }
  }, {
    key: 'exchangeTopic',
    value: function exchangeTopic(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: false };

      return this._exchange(exchangeName, 'topic', options);
    }
  }, {
    key: 'exchangeTopicDurable',
    value: function exchangeTopicDurable(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { durable: true };

      options.durable = options.durable || true;
      return this._exchange(exchangeName, 'topic', options);
    }

    /**
     * @private
     */

  }, {
    key: '_exchange',
    value: function _exchange(exchangeName, type, options) {
      var ex = new Exchange(this._ch, exchangeName, type, options);
      return ex.assert();
    }

    /**
     * @private
     */

  }, {
    key: '_queue',
    value: function _queue(queueName, options) {
      var q = new Queue(this._ch, queueName, options);
      return q.assert();
    }
  }]);

  return Channel;
}();

module.exports = Channel;