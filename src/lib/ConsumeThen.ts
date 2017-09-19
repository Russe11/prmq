/**
 * PRMQ Consume Then
 */

import {Channel} from 'amqplib';

export class ConsumeThen {

  constructor(private ch: Channel, private msg: any) {
  }

  /**
   * Acknowledge the message - Channel#ack
   */
  public ack() {
    this.ch.ack(this.msg);
  }

  /**
   * Reject a message - Channel#nack
   */
  public nack(requeue: boolean = false) {
    this.ch.nack(this.msg, requeue);
  }

  /**
   * Reject a message - Channel#reject
   */
  public reject(requeue: boolean = false) {
    this.ch.reject(this.msg, requeue);
  }
}
