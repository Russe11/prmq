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

import {Options, Replies} from 'amqplib';
import * as Bluebird from 'bluebird';

export enum ExchangeTypes {
  Fanout = 'fanout',
  Direct = 'direct',
  Topic = 'topic'
}

export class ExchangeBase {

  public shouldAssert: boolean = false;

  constructor(
    public channel,
    public exchangeName: string,
    public exchangeType: ExchangeTypes,
    public options?: Options.AssertExchange) {
  }

  public async execAssert(){
    if (this.shouldAssert) {
      await this.channel.assertExchange(this.exchangeName, this.exchangeType, this.options);
      this.shouldAssert = false;
    }
  }

  public get ExchangeName() {
    return this.exchangeName;
  }

  /**
   * Assert an exchange - Channel#assertExchange
   */
  public assert() {
    this.shouldAssert = true;
    return this;
  }

  /**
   * Get the name of the exchange
   */
  public getName() {
    return this.exchangeName;
  }

  /**
   * Is exchange of type = fanout
   */
  public isFanoutExchange() {
    return this.exchangeType === ExchangeTypes.Fanout;
  }

  /**
   * Is exchange of type = direct
   */
  public isDirectExchange() {
    return this.exchangeType === ExchangeTypes.Direct;
  }

  /**
   * Is exchange of type = topic
   * @returns {boolean}
   */
  public isTopicExchange() {
    return this.exchangeType === ExchangeTypes.Topic;
  }

  /**
   * Exchange was created with option { durable: true }
   */
  public get durable() {
    return this.options && this.options.durable === true;
  }

  /**
 * Delete Exchange
 */
  public deleteExchange(): Bluebird<Replies.Empty> {
    return this.channel.deleteExchange(this.exchangeType);
  }

}
