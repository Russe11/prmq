/// <reference types="bluebird" />
/**
 * PRMQ Channel
 */
import { Options, Replies } from 'amqplib';
import * as Bluebird from 'bluebird';
export declare class ChannelBase {
    queueName: string;
    closed: boolean;
    ch: any;
    shouldAssert: boolean;
    constructor(channel: any);
    /**
     */
    checkQueue(queue: string | any): any;
    deleteQueue(queueName: string, options?: Options.DeleteQueue): Bluebird<Replies.DeleteQueue>;
    /**
     */
    deleteQueues(queueNames?: string[], options?: Options.DeleteQueue): Promise<void>;
    /**
     * Close the channel
     */
    close(): Promise<this>;
    isClosed(): boolean;
    /**
     * @private
     */
    static throwClosedChannel(): void;
}
