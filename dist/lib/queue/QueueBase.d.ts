/**
 * PRMQ Queues
 */
import { ConsumeThen } from '../ConsumeThen';
import { Message, Options, Replies } from 'amqplib';
import { ExchangeBase } from '../exchange/ExchangeBase';
import AssertQueue = Replies.AssertQueue;
export declare class QueueBase {
    ch: any;
    queueName: string;
    options: Options.AssertQueue;
    shouldAssert: boolean;
    consumers: any[];
    binds: any[];
    q: AssertQueue;
    constructor(ch: any, queueName: string, options?: Options.AssertQueue);
    execAssert(): Promise<void>;
    execBinds(): Promise<void>;
    execConsumers(): Promise<void>;
    getQueueName(): string;
    /**
     * Queue was created with option { durable: true }
     */
    isDurable(): boolean;
    /**
     * Check if a queue exists
     */
    check(): Promise<void>;
    /**
     * Assert a queue - Channel#assertQueue
     */
    assert(): this;
    bind(exchange: ExchangeBase): this;
    bindWithRouting(exchange: ExchangeBase, routing: string): this;
    bindWithRoutings(exchange: ExchangeBase, routings: string[]): this;
    consume(callbackFn: (msg: any, then: ConsumeThen) => void): this;
    consumeRaw(callbackFn: (msg: Message) => void): this;
    consumeWithAck(callbackFn: (msg: any, then: ConsumeThen) => void): this;
    consumeRawWithAck(callbackFn: (msg: Message, then: ConsumeThen) => void): this;
    /**
     * Channel Prefetch - channel#prefetch
     */
    prefetch(count: number): Promise<this>;
    /**
     */
    execConsume(callbackFn: Function): this;
    execConsumeWithAck(callbackFn: Function): void;
    execConsumeRaw(callbackFn: Function): this;
    execConsumeRawWithAck(callbackFn: Function): this;
}
