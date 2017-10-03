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

import {QueueConf} from '../queue/QueueConf';
import {ConfirmChannel, Options, Replies, Connection} from 'amqplib';
import {ExchangeTypes} from '../exchange/ExchangeBase';
import * as Bluebird from 'bluebird';
import {ChannelBase} from './ChannelBase';
import {ExchangeConf} from '../exchange/ExchangeConf';

export class ChannelConf extends ChannelBase {

  constructor(channel: ConfirmChannel, conn: Connection, private  logResults: boolean = false) {
    super(channel, conn);
  }

  public queue(queueName: string, options?: Options.AssertQueue) {
    const q = new QueueConf(this.ch, queueName, options);
    q.logResults = this.logResults;
    return q.assert();
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

  public deleteQueue(queueName: string, options?: Options.DeleteQueue): Bluebird<Replies.DeleteQueue> {
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

  public exchange(exchangeName: string, exchangeType: ExchangeTypes, options?: Options.AssertExchange) {
    const ex = new ExchangeConf(this.ch, exchangeName, exchangeType, options);
    ex.logResults = this.logResults;
    return ex.assert();
  }

  /**
   * Create an exchange with 'direct' type
   */
  public exchangeDirect(exchangeName: string, options?: Options.AssertExchange) {
    if (this.closed) {
      ChannelBase.throwClosedChannel();
    }
    return this.exchange(exchangeName, ExchangeTypes.Direct, options);
  }

  /**
   * Create an exchange with 'fanout' type
   */
  public exchangeFanout(exchangeName: string, options?: Options.AssertExchange) {
    if (this.closed) {
      ChannelBase.throwClosedChannel();
    }
    return this.exchange(exchangeName, ExchangeTypes.Fanout, options);
  }

  /**
   * Create an exchange with 'topic' type
   */
  public exchangeTopic(exchangeName: string, options: Options.AssertExchange = {}) {
    if (this.closed) {
      ChannelBase.throwClosedChannel();
    }
    return this.exchange(exchangeName, ExchangeTypes.Topic, options);
  }


}
