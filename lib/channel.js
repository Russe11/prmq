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

const Queue = require('./queue');
const Exchange = require('./exchange');

class Channel {
  constructor(channel) {
    this._objectType = 'channel';
    this._ch = channel;
    this._closed = false;
  }

  /**
   * Create an queue with 'direct' type
   * @param {string} queueName
   * @param {ExchangeOptions} options
   * @returns {*}
   */
  queue(queueName, options = { }) {
    if (this._closed) this._throwClosedChannel();
    return this._queue(queueName, options);
  }

  /**
   *
   * @param {Queue|string} queue Queue or queue name
   * @returns {Promise.<void>}
   */
  async checkQueue(queue) {
    let queueName = queue;
    if (typeof queue === 'object') {
      queueName = queue._queueName;
    } else {
      queueName = queue;
    }
    await this._ch.checkQueue(queueName);
  }

  /**
   *
   * @param queueName
   * @param {Object?} options
   * @param {boolean} options.ifUnused
   * @param {boolean} options.ifEmpty
   * @returns {*|void|<Replies.DeleteQueue>|{queue, ifUnused, ifEmpty, ticket, nowait}}
   */
  deleteQueue(queueName, options) {
    if (this._closed) this._throwClosedChannel();
    return this._ch.deleteQueue(queueName, options);
  }

  /**
   *
   * @param queueNames
   * @param options
   * @returns {*|void|{queue, ifUnused, ifEmpty, ticket, nowait}|<Replies.DeleteQueue>}
   */
  async deleteQueues(queueNames = [], options = {}) {
    queueNames.forEach(async (queueName) => {
      await this._ch.deleteQueue(queueName, options);
    });
  }

  /**
   * Create an exchange with 'direct' type
   * @param {string} exchangeName
   * @param {ExchangeOptions} options
   * @returns {*}
   */
  exchangeDirect(exchangeName, options = {}) {
    if (this._closed) this._throwClosedChannel();
    return this._exchange(exchangeName, 'direct', options);
  }

  /**
   * Create an exchange with 'fanout' type
   * @param {string} exchangeName
   * @param {ExchangeOptions} options
   * @returns {*}
   */
  exchangeFanout(exchangeName, options = {}) {
    if (this._closed) this._throwClosedChannel();
    return this._exchange(exchangeName, 'fanout', options);
  }

  /**
   * Create an exchange with 'topic' type
   * @param {string} exchangeName
   * @param {ExchangeOptions} options
   * @returns {*}
   */
  exchangeTopic(exchangeName, options = {}) {
    if (this._closed) this._throwClosedChannel();
    return this._exchange(exchangeName, 'topic', options);
  }

  /**
   * Close the channel
   */
  async close() {
    await this._ch.close();
    this._closed = true;
    return this;
  }

  isClosed() {
    return this._closed;
  }

  /**
   * @private
   */
  _exchange(exchangeName, type, options) {
    const ex = new Exchange(this._ch, exchangeName, type, options);
    return ex.assert();
  }

  /**
   * @private
   */
  _queue(queueName, options) {
    const q = new Queue(this._ch, queueName, options);
    return q.assert();
  }

  /**
   * @private
   */
  _throwClosedChannel(){
    throw new Error('Channel Closed');
  }
}

module.exports = Channel;
