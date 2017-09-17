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

import {Channel, Options, Replies} from 'amqplib';
import * as Bluebird from 'bluebird';

export enum PRMQExchangeTypes {
  Fanout = 'fanout',
  Direct = 'direct',
  Topic = 'topic'
}

export class PRMQExchange {
  private sends: any[];
  private shouldAssert: boolean = false;

  constructor(
    private channel: Channel,
    private exchangeName: string,
    private exchangeType: PRMQExchangeTypes,
    private options?: Options.AssertExchange) {
    this.sends = [];
  }

  public get ExchangeName() {
    return this.exchangeName;
  }

  /**
   * Execute all actions currently pending on the exchange
   * @returns {Promise.<this>}
   */
  public async exec() {
    if (this.shouldAssert) {
      await this.channel.assertExchange(this.exchangeName, this.exchangeType, this.options);
      this.shouldAssert = false;
    }

    this.sends.forEach(async (s) => {
      const msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
      if (!s.routingKey) {
        await this.channel.publish(this.exchangeName, '', Buffer.from(msg));
      } else {
        await this.channel.publish(this.exchangeName, s.routingKey, Buffer.from(msg));
      }
    });
    this.sends = [];
    return this;
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
    return this.exchangeType === PRMQExchangeTypes.Fanout;
  }

  /**
   * Is exchange of type = direct
   */
  public isDirectExchange() {
    return this.exchangeType === PRMQExchangeTypes.Direct;
  }

  /**
   * Is exchange of type = topic
   * @returns {boolean}
   */
  public isTopicExchange() {
    return this.exchangeType === PRMQExchangeTypes.Topic;
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

  /**
   * Public a message to an exchange - Channel#publish
   */
  public publish(message: any, options?: Options.Publish) {
    this.sends.push({ message, options });
    return this;
  }

  /**
   * Publish a message to an exchange with a routing key - Channel#publish
   */
  public publishWithRoutingKey(message: any, routingKey: string, options?: Options.Publish) {
    this.sends.push({ message, routingKey, options });
    return this;
  }
}
