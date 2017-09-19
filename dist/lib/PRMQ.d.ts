import { Replies } from 'amqplib';
import { ChannelConf } from './channel/ChannelConf';
import { ChannelNConf } from './channel/ChannelNConf';
import { ExchangeConf } from './exchange/ExchangeConf';
import { ExchangeNConf } from './exchange/ExchangeNConf';
import { QueueConf } from './queue/QueueConf';
import { QueueNConf } from './queue/QueueNConf';
import { ConsumeThen } from './ConsumeThen';
export { ChannelConf, ChannelNConf, ExchangeConf, ExchangeNConf, QueueConf, QueueNConf, ConsumeThen };
export declare class PRMQ {
    private connectionString;
    private open;
    constructor(connectionString?: string);
    /**
     * Create a RabbitMQ channel
     * @param {number?} prefetch
     */
    channel(prefetch?: number): Promise<ChannelNConf>;
    confirmChannel(prefetch?: number): Promise<ChannelConf>;
    /**
     * Remove exchange and queues from RabbitMQ
     * @param {string[]} exchanges
     * @param {string[]?} queues
     */
    deleteExchangesAndQueues(exchanges: string[], queues?: string[]): Replies.Empty;
}
