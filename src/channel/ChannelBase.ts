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
 * PRMQ Channel
 */

import {Options, Replies} from 'amqplib';
import * as P from 'bluebird';

export class ChannelBase {

  public queueName: string;
  public closed: boolean = false;
  public ch;
  public shouldAssert: boolean;

  constructor(channel) {
    this.ch = channel;
  }

  /**
   */
  public checkQueue(queue: string | any ) {
    let queueName;
    if (typeof queue === 'object') {
      queueName = queue.getQueueName();
    } else {
      queueName = queue;
    }
    return this.ch.checkQueue(queueName);
  }

  public deleteQueue(queueName: string, options?: Options.DeleteQueue): P<Replies.DeleteQueue> {
    if (this.closed) {
      ChannelBase.throwClosedChannel();
    }
    return this.ch.deleteQueue(queueName, options);
  }

  /**
   */
  public async deleteQueues(queueNames: string[] = [],  options?: Options.DeleteQueue) {
    queueNames.forEach(async (queueName) => {
      await this.ch.deleteQueue(queueName, options);
    });
  }

  /**
   * Close the channel
   */
  public async close() {
    await this.ch.close();
    this.closed = true;
    return this;
  }

  public isClosed() {
    return this.closed;
  }

  /**
   * Remove exchange and queues from RabbitMQ
   * @param {string[]} exchanges
   * @param {string[]?} queues
   */
  public async deleteExchangesAndQueues(exchanges: string[], queues: string[] = [])  {
    await P.map(queues, queue => this.ch.deleteQueue(queue))
      .then(() => P.map(exchanges, exchange => this.ch.deleteExchange(exchange)))
  }



  /**
   * @private
   */
  public static throwClosedChannel() {
    throw new Error('Channel Closed');
  }
}
