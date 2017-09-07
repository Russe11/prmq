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

class PRMQ {

  /**
   * @param {string} connectionString
   * @param {boolean} durable
   */
  constructor(connectionString, durable = true) {
    this._durable = durable;
    this._open = amqp.connect(connectionString)
  }

  createExchange(exchangeName) {
    return this._open.then((conn) => {
      return conn.createChannel();
    }).then(ch => {
      return ch.assertExchange(exchangeName, 'fanout', {durable: this._durable})
        .then(() => {
          const exchange = new _exchange(ch, exchangeName, this._durable);
          console.log(exchange)
          return exchange;
        });
    })
  }

  exchange(exchangeName) {
    return this.createExchange(exchangeName);
  }
}

class _exchange {
  constructor(ch, exchangeName, durable) {
    this._ch = ch;
    this._exchangeName = exchangeName;
    this._durable = durable;
  }

  /**
   * Delete Exchange
   * @returns {{exchange, ifUnused, ticket, nowait}|<Replies.Empty>|void}
   */
  delete() {
    return this._ch.deleteExchange(this._exchangeName);
  }

  subscribe(queueName, onMessage) {
    return this._ch.assertQueue(queueName, {durable: this._durable})
      .then(q => {
        return this._ch.bindQueue(q.queue, this._exchangeName, queueName)
          .then(() => {
            this._ch.consume(q.queue, function (msg) {
              onMessage(JSON.parse(msg.content.toString()), () => {
                this._ch.ack(msg)
              })
            }, { noAck: false });
          })
      });
  }

  publish(message) {
    return this._ch.publish(this._exchangeName, '', Buffer.from(JSON.stringify(message)));
  }

}

module.exports = PRMQ;