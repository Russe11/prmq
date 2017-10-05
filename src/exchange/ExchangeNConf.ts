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
 * PRMQ Exchange
 */

import {Channel, Options} from 'amqplib';
import {ExchangeBase, ExchangeTypes} from './ExchangeBase';

export class ExchangeNConf extends ExchangeBase {

  private sends: any = [];

  constructor(
    promise: Promise<any>,
    channel: Channel,
    exchangeName: string,
    exchangeType: ExchangeTypes,
    options?: Options.AssertExchange) {
    super(promise, channel, exchangeName, exchangeType, options);
  }

  /**
   * Execute all actions currently pending on the exchange
   * @returns {Promise.<this>}
   */
  public async exec() {

    this.sends.forEach(async (s) => {
      const msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
      let publishRes;
      if (!s.routingKey) {
        publishRes = await this.channel.publish(this.exchangeName, '', Buffer.from(msg));
      } else {
        publishRes = await this.channel.publish(this.exchangeName, s.routingKey, Buffer.from(msg));
      }
      if (this.logResults === true) {
        this.results.publish.push({
          ex: this.exchangeName,
          routingKey: s.routingKey,
          msg,
          result: publishRes
        });
      }
    });

    this.sends = [];
    return this;
  }

  /**
   * Public a message to an exchange - Channel#publish
   */
  public publish(message: any, options?: Options.Publish) {
    if (this.then === null) {
      this.then = this._thenOff;
    }
    this.sends.push({ message, options });
    this.promise = this.promise.then(() => this.exec());
    return this.promise;
  }

  /**
   * Publish a message to an exchange with a routing key - Channel#publish
   */
  public async publishWithRoutingKey(message: any, routingKey: string, options?: Options.Publish) {
    if (this.then === null) {
      this.then = this._thenOff;
    }
    this.sends.push({ message, routingKey, options });
    this.promise = this.promise.then(() => this.exec());
    return this.promise;
  }

}
