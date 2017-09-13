class ConsumeThen {
  constructor(ch, msg) {
    this._ch = ch;
    this._msg = msg;
  }

  /**
   * Acknowledge the message - Channel#ack
   */
  ack() {
    this._ch.ack(this._msg);
  }

  /**
   * Reject a message - Channel#nack
   */
  nack(requeue = false) {
    this._ch.nack(this._msg, requeue);
  }

  /**
   * Reject a message - Channel#reject
   */
  reject(requeue = false) {
    this._ch.reject(this._msg, requeue);
  }
}

module.exports = ConsumeThen;
