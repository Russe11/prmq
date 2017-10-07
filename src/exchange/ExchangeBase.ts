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

export class ExchangeBase implements Promise<any> {

  public shouldAssert: boolean = false;

  constructor(
    public promise: Promise<any>,
    public channel: any,
    public exchangeName: string,
    public exchangeType: ExchangeTypes,
    public options?: Options.AssertExchange) {
      this.execAssert();
  }

  private resolveSelf: any;
  private rejectSelf: any;
  public thenOff: any;

  public [Symbol.toStringTag]: any;
  public then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) =>
      TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) =>
      TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(() => {
      this.thenOff = this.then;
      this.then = null;
      return this;
    }).then(onfulfilled, onrejected);
  }

  // tslint:disable-next-line:no-reserved-keywords
  public catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<any | TResult> {
    return this.promise.then(onrejected);
  }

  public resolve(val: any) { this.resolveSelf(val); }
  public reject(reason: any) { this.rejectSelf(reason); }

  public results: any = {
    publish: []
  };

  public logResults: boolean;

  public  execAssert() {
    if (this.then === null) {
      this.then = this.thenOff;
    }
    this.promise = this.promise.then(() => this.channel.assertExchange(this.exchangeName, this.exchangeType, this.options)) ;
    return this;
  }

  public get ExchangeName() {
    return this.exchangeName;
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
