/**
 * PRMQ Exchange
 */
import { Channel, Options } from 'amqplib';
import { ExchangeBase, ExchangeTypes } from './ExchangeBase';
export declare class ExchangeNConf extends ExchangeBase {
    sends: any[];
    constructor(channel: Channel, exchangeName: string, exchangeType: ExchangeTypes, options?: Options.AssertExchange);
    /**
     * Execute all actions currently pending on the exchange
     * @returns {Promise.<this>}
     */
    exec(): Promise<this>;
    /**
     * Public a message to an exchange - Channel#publish
     */
    publish(message: any, options: Options.Publish): this;
    /**
     * Publish a message to an exchange with a routing key - Channel#publish
     */
    publishWithRoutingKey(message: any, routingKey: string, options: Options.Publish): this;
}
