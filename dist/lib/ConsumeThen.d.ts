/**
 * PRMQ Consume Then
 */
import { Channel } from 'amqplib';
export declare class ConsumeThen {
    private ch;
    private msg;
    constructor(ch: Channel, msg: any);
    /**
     * Acknowledge the message - Channel#ack
     */
    ack(): void;
    /**
     * Reject a message - Channel#nack
     */
    nack(requeue?: boolean): void;
    /**
     * Reject a message - Channel#reject
     */
    reject(requeue?: boolean): void;
}
