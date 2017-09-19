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
 * PRMQ Queues
 */

import {ConsumeThen} from '../ConsumeThen';
import {Message, Options, Replies} from 'amqplib';
import {ExchangeBase} from '../exchange/ExchangeBase';
import AssertQueue = Replies.AssertQueue;

export class QueueBase {

  public shouldAssert: boolean = false;
  public consumers: any[] = [];
  public binds: any[] = [];
  public q: AssertQueue;

  constructor(public ch, public queueName: string, public options?: Options.AssertQueue) {

  }

  public async execAssert() {
    if (this.shouldAssert) {
      this.q = await this.ch.assertQueue(this.queueName, this.options);
    }
  }

  public async execBinds() {
    this.binds.forEach(async (b) => {
      await this.ch.bindQueue(this.q.queue, b.exchangeName, b.routing);
    });
  }

  public async execConsumers() {
    this.consumers.forEach((c) => {
      if (c.noAck === true && c.raw === false) {
        this.execConsume(c.callbackFn);
      } else if (c.noAck === false && c.raw === false) {
        this.execConsumeWithAck(c.callbackFn);
      } else if (c.noAck === true && c.raw === true) {
        this.execConsumeRaw(c.callbackFn);
      } else if (c.noAck === false && c.raw === true) {
        this.execConsumeRawWithAck(c.callbackFn);
      }
    });
  }

  public getQueueName() {
    return this.queueName;
  }

  /**
   * Queue was created with option { durable: true }
   */
  public isDurable() {
    return this.options && this.options.durable === true;
  }

  /**
   * Check if a queue exists
   */
  public async check() {
    await this.ch.checkQueue(this.queueName);
  }

  /**
   * Assert a queue - Channel#assertQueue
   */
  public assert() {
    this.shouldAssert = true;
    return this;
  }

  public bind(exchange: ExchangeBase) {
    this.binds.push({ exchangeName: exchange.ExchangeName });
    return this;
  }

  public bindWithRouting(exchange: ExchangeBase, routing: string) {
    this.binds.push({ exchangeName: exchange.ExchangeName, routing });
    return this;
  }

  public bindWithRoutings(exchange: ExchangeBase, routings: string[]) {
    routings.forEach((routing) => {
      this.binds.push({ exchangeName: exchange.ExchangeName, routing });
    });
    return this;
  }

  public consume(callbackFn: (msg: any, then: ConsumeThen) => void) {
    this.consumers.push({ noAck: true, raw: false, callbackFn });
    return this;
  }

  public consumeRaw(callbackFn: (msg: Message) => void) {
    this.consumers.push({ noAck: true, raw: true, callbackFn });
    return this;
  }

  public consumeWithAck(callbackFn: (msg: any, then: ConsumeThen) => void) {
    this.consumers.push({ noAck: false, raw: false, callbackFn });
    return this;
  }

  public consumeRawWithAck(callbackFn: (msg: Message, then: ConsumeThen) => void) {
    this.consumers.push({ noAck: false, raw: true, callbackFn });
    return this;
  }

  /**
   * Channel Prefetch - channel#prefetch
   */
  public async prefetch(count: number) {
    await this.ch.prefetch(count);
    return this;
  }

  /**
   */
  public execConsume(callbackFn: Function) {
    this.ch.consume(this.q.queue, (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        callbackFn(content.startsWith('{') ? JSON.parse(content) : content);
      }
    }, { noAck: true });
    return this;
  }

  public execConsumeWithAck(callbackFn: Function) {
    this.ch.consume(this.q.queue, (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        callbackFn(
          content.startsWith('{') ? JSON.parse(content) : content,
          new ConsumeThen(this.ch, msg)
        );
      }
    }, { noAck: false });
  }

  public execConsumeRaw(callbackFn: Function) {
    this.ch.consume(this.q.queue, msg => callbackFn(msg, () => {
      this.ch.ack(msg);
    }), { noAck: true });
    return this;
  }

  public execConsumeRawWithAck(callbackFn: Function) {
    this.ch.consume(this.q.queue, msg => callbackFn(msg, () => {
      this.ch.ack(msg);
    }), { noAck: false });
    return this;
  }
}
