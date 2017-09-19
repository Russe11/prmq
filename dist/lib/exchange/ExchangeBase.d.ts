/// <reference types="bluebird" />
/**
 * PRMQ Exchange
 */
import { Options, Replies } from 'amqplib';
import * as Bluebird from 'bluebird';
export declare enum ExchangeTypes {
    Fanout = "fanout",
    Direct = "direct",
    Topic = "topic",
}
export declare class ExchangeBase {
    channel: any;
    exchangeName: string;
    exchangeType: ExchangeTypes;
    options: Options.AssertExchange;
    shouldAssert: boolean;
    constructor(channel: any, exchangeName: string, exchangeType: ExchangeTypes, options?: Options.AssertExchange);
    execAssert(): Promise<void>;
    readonly ExchangeName: string;
    /**
     * Assert an exchange - Channel#assertExchange
     */
    assert(): this;
    /**
     * Get the name of the exchange
     */
    getName(): string;
    /**
     * Is exchange of type = fanout
     */
    isFanoutExchange(): boolean;
    /**
     * Is exchange of type = direct
     */
    isDirectExchange(): boolean;
    /**
     * Is exchange of type = topic
     * @returns {boolean}
     */
    isTopicExchange(): boolean;
    /**
     * Exchange was created with option { durable: true }
     */
    readonly durable: boolean;
    /**
   * Delete Exchange
   */
    deleteExchange(): Bluebird<Replies.Empty>;
}
