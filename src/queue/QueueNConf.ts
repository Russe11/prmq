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

import {Channel, Options} from 'amqplib';
import {QueueBase} from './QueueBase';

export class QueueNConf extends QueueBase {

  private sends: { message: any, options?: Options.Publish}[] = [];

  constructor(promise, ch: Channel, queueName: string, options?: Options.AssertQueue) {
    super(promise, ch, queueName, options);
  }

  public async exec() {

    this.sends.forEach(async (s) => {
      const msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
      const sendRes = await this.ch.sendToQueue(this.q.queue, Buffer.from(msg), s.options);
      if (this.logResults === true) {
        this.results.send.push({
          q: this.q.queue,
          msg,
          result: sendRes
        });
      }

    });
    this.sends = [];
    return this;
  }

  public async send(message: any, options?: Options.Publish) {
    this.sends.push({ message, options });
    this.promise = this.promise.then(() => this.exec());
    return this.promise;
  }

}
