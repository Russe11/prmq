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

class PRMQ {

  /**
   * @param {string} connectionString
   * @param {boolean} durable
   */
  constructor(connectionString, durable = true) {
    this._open = amqp.connect(connectionString)
    this._ch;
  }

  getChannel() {
    if (this._ch) {
      return new P((resolve) => resolve(this._ch));
    }
    return this._open.then((conn) => {
      return conn.createChannel();
    })
      .then(ch => {
        this._ch = ch;
        return ch;
      })
  }

  queue(queueName, options) {
    return this.getChannel()
      .then(ch => new Queue(ch, queueName, options));
  }

  /**
   * Create a RabbitMQ exchange
   * @param {string} exchangeName 
   * @param {*?} options 
   */
  exchange(exchangeName, type, options) {
    return this.getChannel()
      .then(ch => new Exchange(ch, exchangeName, 'fanout', options))
        .then(exchange => exchange.assert())
  }


  /**
   * Remove exchange and queues from RabbitMQ
   * @param {string} exchangeName 
   * @param {string[]?} queues 
   */
  deleteExchangeAndQueues(exchangeName, queues = []) {
    return this._open.then((conn) => {
      return conn.createChannel();
    }).then(ch => {
      return P.join(
        ch.deleteExchange(exchangeName),
        P.map(queues, (queue) => {
          return ch.deleteQueue(queue);
        })
      );
    })
  }

  /**
   * Remove exchange from RabbitMQ
   * @param {string} exchangeName 
   */
  deleteExchange(exchangeName) {
    return this.deleteExchangeAndQueues(exchangeName)
  }

}



class Exchange {
  constructor(ch, exchangeName, type, options) {
    this._ch = ch;
    this._exchangeName = exchangeName;
    this._options = options;
    this._type = type;
  }

  assert() {
    return this._ch.assertExchange(this._exchangeName, this._type, this._options)
      .then(() => this);
  }

  /**
   * Delete Exchange
   * @returns {{exchange, ifUnused, ticket, nowait}|<Replies.Empty>|void}
   */
  delete() {
    return this._ch.deleteExchange(this._exchangeName);
  }

  subscribe(queueName, options, onMessage) {
    return this._ch.assertQueue(queueName, options)
      .then(q => {
        return this._ch.bindQueue(q.queue, this._exchangeName, queueName)
          .then(() => {
            this._ch.consume(q.queue, (msg) => {
              onMessage(JSON.parse(msg.content.toString()), () => {
                this._ch.ack(msg)
              })
            }, { noAck: false });
          })
      });
  }

  unsubscribe(queue, options) {
    return this._ch.unbindQueue
  }

  publish(message) {
    return this._ch.publish(this._exchangeName, '', Buffer.from(JSON.stringify(message)));
  }

}

class Queue {
  constructor (ch, queueName, options) {
    this._ch = ch;
    this._queueName = queueName;
    this._options = options;

  }

  assert() {

    return this._ch.assertQueue(this._queueName, this._options)
      .then(q => {
        this._q = q;
      })
  }

  bindWithExchange(exchange) {
    return this._ch.bindQueue(this._q.queue, exchange._exchangeName, this._queueName);
  }

  onMessage(cb) {
    this._ch.consume(this._q.queue, (msg) => {
      return cb(msg.content.toString());
    }, {noAck: true});
  }

  onMessageWithAck(cb) {
    this._ch.consume(q.queue, (msg) => {
      return cb(msg, () => {
        this._ch.ack(msg.content.toString())
      })
    }, { noAck: false });
  }

}

module.exports = PRMQ;