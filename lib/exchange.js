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


class Exchange {
  /**
   *
   * @param {Channel} channel
   * @param {string} exchangeName
   * @param {string} type
   * @param {object} options
   */
  constructor(channel, exchangeName, type, options) {
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
  async exec() {
    if (this._shouldAssert) {
      await this._ch.assertExchange(this._exchangeName, this._type, this._options);
      this._shouldAssert = false;
    }

    this._sends.forEach(async (s) => {
      const msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
      if (!s.routingKey) {
        await this._ch.publish(this._exchangeName, '', Buffer.from(msg));
      } else {
        await this._ch.publish(this._exchangeName, s.routingKey, Buffer.from(msg));
      }
    });
    this._sends = [];
    return this;
  }

  /**
   * Assert an exchange - Channel#assertExchange
   * @returns {Exchange}
   */
  assert() {
    this._shouldAssert = this;
    return this;
  }


  /**
   * Get the name of the exchange
   * @returns {string}
   */
  getName() {
    return this._exchangeName;
  }

  /**
   * Is exchange of type = fanout
   * @returns {boolean}
   */
  isFanoutExchange() {
    return this._type === 'fanout';
  }

  /**
   * Is exchange of type = direct
   * @returns {boolean}
   */
  isDirectExchange() {
    return this._type === 'direct';
  }

  /**
   * Is exchange of type = topic
   * @returns {boolean}
   */
  isTopicExchange() {
    return this._type === 'topic';
  }

  /**
   * Exchange was created with option { durable: true }
   * @returns {*|boolean}
   */
  isDurable() {
    return this._options && this._options.durable === true;
  }

  /**
   * Delete Exchange
   * @returns {{exchange, ifUnused, ticket, nowait}|<Replies.Empty>|void}
   */
  deleteExchange() {
    return this._ch.deleteExchange(this._exchangeName);
  }

  /**
   * Public a message to an exchange - Channel#publish
   * @param {string|Object} message
   * @param {PublishOptions?} options
   * @returns {Exchange}
   */
  publish(message, options) {
    this._sends.push({ message, options });
    return this;
  }

  /**
   * Publish a message to an exchange with a routing key - Channel#publish
   * @param {string|Object} message
   * @param {string} routingKey
   * @returns {Exchange}
   */
  publishWithRoutingKey(message, routingKey) {
    this._sends.push({ message, routingKey });
    return this;
  }
}

module.exports = Exchange;
