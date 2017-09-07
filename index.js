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
   * @param {boolean} durable
   */
  constructor(connectionString) {
    this._open = amqp.connect(connectionString);
  }

  getChannel() {
    if (this._ch) {
      return P.resolve(this._ch);
    }
    return this._open
      .then(conn => conn.createChannel())
      .then((ch) => {
        this._ch = ch;
        return ch;
      });
  }

  queue(queueName, options) {
    return this.getChannel()
      .then(ch => new Queue(ch, queueName, options))
      .then(q => q.assertQueue())
  }

  /**
   * Create a Exchange and assert to RabbitMQ server
   * @param {string} exchangeName
   * @param {*?} options
   */
  exchange(exchangeName, type, options) {
    return this.getChannel()
      .then(ch => new Exchange(ch, exchangeName, type, options))
      .then(ex => ex.assertExchange());
  }



  /**
   * Remove exchange and queues from RabbitMQ
   * @param {string} exchangeName
   * @param {string[]?} queues
   */
  deleteExchangeAndQueues(exchangeName, queues = []) {
    return this._open
      .then(conn => conn.createChannel())
      .then((ch) => P.join(
        ch.deleteExchange(exchangeName),
        P.map(queues, queue => ch.deleteQueue(queue))
      ));
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
