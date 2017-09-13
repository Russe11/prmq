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

/**
 * Options for Queue
 * @typedef {Object} ExchangeOptions
 * @property {boolean} exclusive
 * @property {boolean} durable
 * @property {boolean} autoDelete
 * @property {Object} arguments
 */

/**
 * Options for Exchange
 * @typedef {Object} ExchangeOptions
 * @property {boolean} durable
 * @property {boolean} autoDelete
 * @property {string} alternateExchange
 * @property {Object} arguments
 */

var Queue = require('./queue');
var Exchange = require('./exchange');

var Channel = function () {
  function Channel(channel) {
    _classCallCheck(this, Channel);

    this._ch = channel;
  }

  /**
   * Create an queue with 'direct' type
   * @param {string} queueName
   * @param {ExchangeOptions} options
   * @returns {*}
   */


  _createClass(Channel, [{
    key: 'queue',
    value: function queue(queueName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._queue(queueName, options);
    }

    /**
     *
     * @param queueName
     * @param {Object?} options
     * @param {boolean} options.ifUnused
     * @param {boolean} options.ifEmpty
     * @returns {*|void|<Replies.DeleteQueue>|{queue, ifUnused, ifEmpty, ticket, nowait}}
     */

  }, {
    key: 'deleteQueue',
    value: function deleteQueue(queueName, options) {
      return this._ch.deleteQueue(queueName, options);
    }

    /**
     * Create an exchange with 'direct' type
     * @param {string} exchangeName
     * @param {ExchangeOptions} options
     * @returns {*}
     */

  }, {
    key: 'exchangeDirect',
    value: function exchangeDirect(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._exchange(exchangeName, 'direct', options);
    }

    /**
     * Create an exchange with 'fanout' type
     * @param {string} exchangeName
     * @param {ExchangeOptions} options
     * @returns {*}
     */

  }, {
    key: 'exchangeFanout',
    value: function exchangeFanout(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._exchange(exchangeName, 'fanout', options);
    }

    /**
     * Create an exchange with 'topic' type
     * @param {string} exchangeName
     * @param {ExchangeOptions} options
     * @returns {*}
     */

  }, {
    key: 'exchangeTopic',
    value: function exchangeTopic(exchangeName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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