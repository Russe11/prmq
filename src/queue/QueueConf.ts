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

import {ConfirmChannel, Options} from 'amqplib';
import {QueueBase} from './QueueBase';

export class QueueConf extends QueueBase{

  public  shouldAssert: boolean = false;
  private sends: { message: any, options?: Options.Publish, confirmationFn: Function}[] = [];

  constructor(ch: ConfirmChannel, queueName: string, options?: Options.AssertQueue) {
    super(ch, queueName, options);
  }

  public async exec() {
    await this.execAssert();
    await this.execBinds();
    await this.execConsumers();
    this.sends.forEach(async (s) => {
      const msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
      await this.ch.sendToQueue(this.q.queue, Buffer.from(msg), s.options, s.confirmationFn);
    });
  }

  public send(message: any, options: Options.Publish, confirmationFn: Function) {
    this.sends.push({ message, options, confirmationFn });
    return this;
  }

}
