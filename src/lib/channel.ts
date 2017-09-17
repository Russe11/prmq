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

import {PRMQQueue} from './queue';
import {Channel, Options, Replies} from "amqplib";
import {PRMQExchange, PRMQExchangeTypes} from "./exchange";
import * as Bluebird from "bluebird";

export class PRMQChannel {

  private _queueName: string;
  private _closed: boolean = false;
  private _ch: Channel;

  constructor(channel: Channel) {
    this._ch = channel;
  }

  /**
   * Create an queue with 'direct' type
   */
  queue(queueName: string, options?: Options.AssertQueue) {
    if (this._closed) PRMQChannel._throwClosedChannel();
    return this._queue(queueName, options);
  }

  /**
   */
  public checkQueue(queue: string | any ) {
    let queueName = queue;
    if (typeof queue === 'object') {
      queueName = queue._queueName;
    } else {
      queueName = queue;
    }
    return this._ch.checkQueue(queueName)
  }

  public deleteQueue(queueName: string, options?: Options.DeleteQueue): Bluebird<Replies.DeleteQueue> {
    if (this._closed) PRMQChannel._throwClosedChannel();
    return this._ch.deleteQueue(queueName, options);
  }

  /**
   */
  async deleteQueues(queueNames: Array<string> = [],  options?: Options.DeleteQueue) {
    queueNames.forEach(async (queueName) => {
      await this._ch.deleteQueue(queueName, options);
    });
  }

  /**
   * Create an exchange with 'direct' type
   */
  exchangeDirect(exchangeName: string, options?: Options.AssertExchange) {
    if (this._closed) PRMQChannel._throwClosedChannel();
    return this._exchange(exchangeName, PRMQExchangeTypes.Direct, options);
  }

  /**
   * Create an exchange with 'fanout' type
   */
  exchangeFanout(exchangeName, options?: Options.AssertExchange) {
    if (this._closed) PRMQChannel._throwClosedChannel();
    return this._exchange(exchangeName, PRMQExchangeTypes.Fanout, options);
  }

  /**
   * Create an exchange with 'topic' type
   */
  exchangeTopic(exchangeName:string, options: Options.AssertExchange = {}) {
    if (this._closed) PRMQChannel._throwClosedChannel();
    return this._exchange(exchangeName, PRMQExchangeTypes.Topic, options);
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
  _exchange(exchangeName: string, type: PRMQExchangeTypes, options) {
    const ex = new PRMQExchange(this._ch, exchangeName, type, options);
    return ex.assert();
  }

  private _queue(queueName: string, options: Options.AssertQueue) {
    const q = new PRMQQueue(this._ch, queueName, options);
    return q.assert();
  }

  /**
   * @private
   */
  private static _throwClosedChannel(){
    throw new Error('Channel Closed');
  }
}
