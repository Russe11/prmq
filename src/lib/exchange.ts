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

import {Channel, Options, Replies} from "amqplib";
import * as Bluebird from 'bluebird'

export enum PRMQExchangeTypes {
  Fanout = 'fanout',
  Direct = 'direct',
  Topic = 'topic'
}

export class PRMQExchange {

  private _ch: Channel;
  private _exchangeName: string;
  private _options: any;
  private _type: PRMQExchangeTypes;
  private _sends: Array<any>;
  private _shouldAssert = false;


  constructor(channel, exchangeName, type, options) {
    this._ch = channel;
    this._exchangeName = exchangeName;
    this._options = options;
    this._type = type;
    this._sends = [];
  }

  public get ExchangeName() {
    return this._exchangeName;
  }

  /**
   * Execute all actions currently pending on the exchange
   * @returns {Promise.<this>}
   */
  async exec() {
    if (this._shouldAssert) {
      await this._ch.assertExchange(this._exchangeName, this._type, this._options);
      this._shouldAssert = false;
    }

    this._sends.forEach(async (s) => {
      const msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
      if (!s.routingKey) {
        await this._ch.publish(this._exchangeName, '', Buffer.from(msg));
      } else {
        await this._ch.publish(this._exchangeName, s.routingKey, Buffer.from(msg));
      }
    });
    this._sends = [];
    return this;
  }

  /**
   * Assert an exchange - Channel#assertExchange
   */
  assert() {
    this._shouldAssert = true;
    return this;
  }

  /**
   * Get the name of the exchange
   */
  getName() {
    return this._exchangeName;
  }

  /**
   * Is exchange of type = fanout
   * @returns {boolean}
   */
  isFanoutExchange() {
    return this._type === PRMQExchangeTypes.Fanout;
  }

  /**
   * Is exchange of type = direct
   * @returns {boolean}
   */
  isDirectExchange() {
    return this._type === PRMQExchangeTypes.Direct;
  }

  /**
   * Is exchange of type = topic
   * @returns {boolean}
   */
  isTopicExchange() {
    return this._type === PRMQExchangeTypes.Topic;
  }

  /**
   * Exchange was created with option { durable: true }
   */
  public get durable() {
    return this._options && this._options.durable === true;
  }

  /**
 * Delete Exchange
 */
deleteExchange(): Bluebird<Replies.Empty> {
  return this._ch.deleteExchange(this._exchangeName);
}

  /**
   * Public a message to an exchange - Channel#publish
   */
  publish(message: any, options?: Options.Publish) {
    this._sends.push({ message, options });
    return this;
  }

  /**
   * Publish a message to an exchange with a routing key - Channel#publish
   */
  publishWithRoutingKey(message: any, routingKey: string, options?: Options.Publish) {
    this._sends.push({ message, routingKey, options });
    return this;
  }
}
