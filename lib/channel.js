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

const Queue = require('./queue');
const Exchange = require('./exchange');

class Channel {

  constructor(channel, exchangeName, type, options) {
    this._ch = channel;
  }

  queue(queueName, options = { durable: false, exclusive: false }) {
    return this._queue(queueName, options);
  }

  queueExclusive(queueName, options = { exclusive: true }) {
    options.exclusive = options.exclusive || true;
    return this._queue(queueName, options);
  }

  queueDurable(queueName, options = { durable: true }) {
    options.exclusive = options.exclusive || true;
    return this._queue(queueName, options);
  }

  queueDurableExclusive(queueName, options = { durable: true, exclusive: true }) {
    options.exclusive = options.exclusive || true;
    options.durable = options.durable || true;
    return this._queue(queueName, options);
  }

  exchangeDirect(exchangeName, options = { durable: false }) {
    options.durable = options.durable || true;
    return this._exchange(exchangeName, 'fanout', options)
  }

  exchangeDirectDurable(exchangeName, options = { durable: true }) {
    return this._exchange(exchangeName, 'fanout', options)
  }

  exchangeFanout(exchangeName, options = { durable: false }) {
    return this._exchange(exchangeName, 'fanout', options)
  }

  exchangeFanoutDurable(exchangeName, options =  { durable: true }) {
    options.durable = options.durable || true;
    return this._exchange(exchangeName, 'fanout', options)
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


}

module.exports = Channel;
