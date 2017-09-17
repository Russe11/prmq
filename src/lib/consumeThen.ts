import {Channel} from "amqplib";

export class PRMQConsumeThen {

  constructor(private ch: Channel, private msg: any) {
  }

  /**
   * Acknowledge the message - Channel#ack
   */
  ack() {
    this.ch.ack(this.msg);
  }

  /**
   * Reject a message - Channel#nack
   */
  nack(requeue = false) {
    this.ch.nack(this.msg, requeue);
  }

  /**
   * Reject a message - Channel#reject
   */
  reject(requeue = false) {
    this.ch.reject(this.msg, requeue);
  }
}
