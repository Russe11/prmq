/**
 * PRMQ Channel
 */
import { QueueNConf } from '../queue/QueueNConf';
import { Channel, Options } from 'amqplib';
import { ExchangeTypes } from '../exchange/ExchangeBase';
import { ChannelBase } from './ChannelBase';
import { ExchangeNConf } from '../exchange/ExchangeNConf';
export declare class ChannelNConf extends ChannelBase {
    constructor(channel: Channel);
    queue(queueName: string, options?: Options.AssertQueue): QueueNConf;
    exchange(exchangeName: string, exchangeType: ExchangeTypes, options?: Options.AssertExchange): ExchangeNConf;
    /**
     * Create an exchange with 'direct' type
     */
    exchangeDirect(exchangeName: string, options?: Options.AssertExchange): ExchangeNConf;
    /**
     * Create an exchange with 'fanout' type
     */
    exchangeFanout(exchangeName: string, options?: Options.AssertExchange): ExchangeNConf;
    /**
     * Create an exchange with 'topic' type
     */
    exchangeTopic(exchangeName: string, options?: Options.AssertExchange): ExchangeNConf;
}
