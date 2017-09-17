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

import * as amqp from 'amqplib';
import * as P from 'bluebird';
import { PRMQChannel } from './lib/channel';
import { PRMQExchange } from "./lib/exchange";
import { PRMQQueue } from "./lib/queue";
import { PRMQConsumeThen } from "./lib/consumeThen";

export { PRMQChannel, PRMQExchange, PRMQQueue, PRMQConsumeThen }

export class PRMQ {

  private _open;


  constructor(connectionString?: string) {
    this._open = amqp.connect(connectionString);
  }

  /**
   * Create a RabbitMQ channel
   * @param {number?} prefetch
   */
  async channel(prefetch?) {
    const conn = await this._open;
    const ch = await conn.createChannel();
    if (prefetch) {
      ch.prefetch(prefetch);
    }
    return new PRMQChannel(ch);
  }

  /**
   * Remove exchange and queues from RabbitMQ
   * @param {string[]} exchanges
   * @param {string[]?} queues
   */
  deleteExchangesAndQueues(exchanges, queues = []) {
    var output = this._open
      .then(conn => conn.createChannel())
      .then(ch =>
        P.map(queues, queue => ch.deleteQueue(queue))
          .then(() => P.map(exchanges, exchange => ch.deleteExchange(exchange))));
    return output;
  }
}
