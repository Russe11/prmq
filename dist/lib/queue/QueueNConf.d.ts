/**
 * PRMQ Queues
 */
import { Channel, Options } from 'amqplib';
import { QueueBase } from './QueueBase';
export declare class QueueNConf extends QueueBase {
    private sends;
    constructor(ch: Channel, queueName: string, options?: Options.AssertQueue);
    exec(): Promise<void>;
    send(message: any, options: Options.Publish): this;
}
