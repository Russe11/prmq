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

import {PRMQConsumeThen} from './consumeThen';
import {Channel, Message, Options} from "amqplib";
import {PRMQExchange} from "./exchange";

export class PRMQQueue {

  private _queueName: string;
  private _ch: Channel;
  private _options: Options.AssertQueue;
  private _shouldAssert = false;
  private _sends: Array<{ message: any, options?: Options.Publish}> = [];
  private _consumers: Array<any> = [];
  private _binds: Array<any> = [];
  private _q: any;

  constructor(ch: Channel, queueName: string, options?) {
    this._queueName = queueName;
    this._ch = ch;
    this._options = options;
  }

  /**
   * Execute all actions currently pending on the queue
   */
  public async exec() {
    if (this._shouldAssert) {
      this._q = await this._ch.assertQueue(this.queueName, this._options);
    }

    this._binds.forEach(async (b) => {
      await this._ch.bindQueue(this._q.queue, b.exchangeName, b.routing);
    });

    this._consumers.forEach((c) => {
      if (c.noAck === true && c.raw === false) {
        this._consume(c.callbackFn);
      } else if (c.noAck === false && c.raw === false) {
        this._consumeWithAck(c.callbackFn);
      } else if (c.noAck === true && c.raw === true) {
        this._consumeRaw(c.callbackFn);
      } else if (c.noAck === false && c.raw === true) {
        this._consumeRawWithAck(c.callbackFn);
      }
    });

    this._sends.forEach(async (s) => {
      const msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
      await this._ch.sendToQueue(this._q.queue, Buffer.from(msg), s.options);
    });

    return this;
  }

  get queueName() {
    return this._queueName;
  }

  get shouldAssert() {
    return this._shouldAssert;
  }

  /**
   * Queue was created with option { durable: true }
   */
  get durable() {
    return this._options && this._options.durable === true;
  }

  /**
   * Check if a queue exists
   */
  public async check() {
    await this._ch.checkQueue(this._queueName);
  }

  /**
   * Assert a queue - Channel#assertQueue
   */
  assert() {
    this._shouldAssert = true;
    return this;
  }

  /**
   * Send a message to a queue
   */
  send(message, options = {}) {
    this._send(message, options);
    return this;
  }

  _send(message, options) {
    this._sends.push({ message, options });
  }

  bind(exchange: PRMQExchange) {
    this._binds.push({ exchangeName: exchange.ExchangeName });
    return this;
  }

  bindWithRouting(exchange: PRMQExchange, routing: string) {
    this._binds.push({ exchangeName: exchange.ExchangeName, routing });
    return this;
  }

  bindWithRoutings(exchange: PRMQExchange, routings: Array<string>) {
    routings.forEach((routing) => {
      this._binds.push({ exchangeName: exchange.ExchangeName, routing });
    });
    return this;
  }

  consume(callbackFn: (msg: any, then: PRMQConsumeThen) => void) {
    this._consumers.push({ noAck: true, raw: false, callbackFn });
    return this;
  }

  consumeRaw(callbackFn: (msg: Message) => void) {
    this._consumers.push({ noAck: true, raw: true, callbackFn });
    return this;
  }

  consumeWithAck(callbackFn: (msg: any, then: PRMQConsumeThen) => void) {
    this._consumers.push({ noAck: false, raw: false, callbackFn });
    return this;
  }

  consumeRawWithAck(callbackFn: (msg: Message, then: PRMQConsumeThen) => void) {
    this._consumers.push({ noAck: false, raw: true, callbackFn });
    return this;
  }

  /**
   * Channel Prefetch - channel#prefetch
   */
  async prefetch(count) {
    await this._ch.prefetch(count);
    return this;
  }

  /**
   */
  private _consume(cb) {
    this._ch.consume(this._q.queue, (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        cb(content.startsWith('{') ? JSON.parse(content) : content);
      }
    }, { noAck: true });
    return this;
  }

  private _consumeWithAck(cb) {
    this._ch.consume(this._q.queue, (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        cb(
          content.startsWith('{') ? JSON.parse(content) : content,
          new PRMQConsumeThen(this._ch, msg),
        );
      }
    }, { noAck: false });
  }

  private _consumeRaw(cb) {
    this._ch.consume(this._q.queue, msg => cb(msg, () => {
      this._ch.ack(msg);
    }), { noAck: true });
    return this;
  }

  private _consumeRawWithAck(cb) {
    this._ch.consume(this._q.queue, msg => cb(msg, () => {
      this._ch.ack(msg);
    }), { noAck: false });
    return this;
  }
}
