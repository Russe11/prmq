/**
 * PRMQ Queues
 */
import { ConfirmChannel, Options } from 'amqplib';
import { QueueBase } from './QueueBase';
export declare class QueueConf extends QueueBase {
    shouldAssert: boolean;
    private sends;
    constructor(ch: ConfirmChannel, queueName: string, options?: Options.AssertQueue);
    exec(): Promise<void>;
    send(message: any, options: Options.Publish, confirmationFn: Function): this;
}
