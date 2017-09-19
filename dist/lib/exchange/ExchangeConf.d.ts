/**
 * PRMQ Exchange
 */
import { ConfirmChannel, Options } from 'amqplib';
import { ExchangeBase, ExchangeTypes } from './ExchangeBase';
export declare class ExchangeConf extends ExchangeBase {
    private sends;
    constructor(channel: ConfirmChannel, exchangeName: string, exchangeType: ExchangeTypes, options?: Options.AssertExchange);
    /**
     * Execute all actions currently pending on the exchange
     * @returns {Promise.<this>}
     */
    exec(): Promise<void>;
    /**
     * Public a message to an exchange - Channel#publish
     */
    publish(message: any, options: Options.Publish, confirmationFn: Function): this;
    /**
     * Publish a message to an exchange with a routing key - Channel#publish
     */
    publishWithRoutingKey(message: any, routingKey: string, options: Options.Publish, confirmationFn: Function): this;
}
