/// <reference types="bluebird" />
/**
 * PRMQ Channel
 */
import { QueueConf } from '../queue/QueueConf';
import { ConfirmChannel, Options, Replies } from 'amqplib';
import { ExchangeTypes } from '../exchange/ExchangeBase';
import * as Bluebird from 'bluebird';
import { ChannelBase } from './ChannelBase';
import { ExchangeConf } from '../exchange/ExchangeConf';
export declare class ChannelConf extends ChannelBase {
    constructor(channel: ConfirmChannel);
    queue(queueName: string, options?: Options.AssertQueue): QueueConf;
    /**
     */
    checkQueue(queue: string | any): any;
    deleteQueue(queueName: string, options?: Options.DeleteQueue): Bluebird<Replies.DeleteQueue>;
    /**
     */
    deleteQueues(queueNames?: string[], options?: Options.DeleteQueue): Promise<void>;
    exchange(exchangeName: string, exchangeType: ExchangeTypes, options?: Options.AssertExchange): ExchangeConf;
    /**
     * Create an exchange with 'direct' type
     */
    exchangeDirect(exchangeName: string, options?: Options.AssertExchange): ExchangeConf;
    /**
     * Create an exchange with 'fanout' type
     */
    exchangeFanout(exchangeName: string, options?: Options.AssertExchange): ExchangeConf;
    /**
     * Create an exchange with 'topic' type
     */
    exchangeTopic(exchangeName: string, options?: Options.AssertExchange): ExchangeConf;
}
