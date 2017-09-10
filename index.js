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

const amqp = require('amqplib');
const P = require('bluebird');
const Exchange = require('./lib/exchange');
const Queue = require('./lib/queue');

class PRMQ {
  /**
   * @param {string} connectionString
   */
  constructor(connectionString) {
    this._open = amqp.connect(connectionString);
  }

  /**
   * Create a RabbitMQ channel
   * @param {number} prefetch
   * @returns {Promise.<TResult>}
   */
  getChannel(prefetch) {
    if (this._ch) {
      return P.resolve(this._ch);
    }
    return this._open
      .then(conn => conn.createChannel())
      .then((ch) => {
        if (prefetch) {
          ch.prefetch(prefetch);
        }
        this._ch = ch;
        return ch;
      });
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

  sendToQueue(queueName, options = { durable: false, exclusive: false }) {
    return this._queue(queueName, options);
  }

  sendToQueueExclusive(queueName, options = { exclusive: true }) {
    options.exclusive = options.exclusive || true;
    return this._queue(queueName, options);
  }

  sendToQueueDurable(queueName, options = { durable: true }) {
    options.exclusive = options.exclusive || true;
    return this._queue(queueName, options);
  }

  sendToQueueDurableExclusive(queueName, options = { durable: true, exclusive: true }) {
    options.exclusive = options.exclusive || true;
    options.durable = options.durable || true;
    return this._queue(queueName, options);
  }

  /**
   * @private
   */
  _queue(queueName, options) {
    return this.getChannel()
      .then(ch => new Queue(ch, queueName, options))
      .then(q => q.init())
      .then(q => q.assertQueue());
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
    return this.getChannel()
      .then(ch => new Exchange(ch, exchangeName, type, options))
      .then(ex => ex.assertExchange());
  }


  /**
   * Remove exchange and queues from RabbitMQ
   * @param {string} exchangeName
   * @param {string[]?} queues
   */
  deleteExchangesAndQueues(exchanges, queues = []) {

    return this._open
      .then(conn => conn.createChannel())

      .then((ch) =>
        P.map(queues, queue => ch.deleteQueue(queue))
          .then(() => P.map(exchanges, exchange => ch.deleteExchange(exchange)))
      )
  }

  /**
   * Remove exchange from RabbitMQ
   * @param {string} exchangeName
   */
  deleteExchange(exchangeName) {
    return this.deleteExchangeAndQueues(exchangeName)
  }

}

module.exports = PRMQ;
