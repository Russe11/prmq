"use strict";

class ConsumeThen {
  constructor(ch, msg) {
    this._ch = ch;
    this._msg = msg;
  }

  ack() {
    this._ch.ack(this._msg);
  }

  nack(requeue = false) {
    this._ch.nack(this._msg, requeue);
  }

  reject(requeue = false) {
    this._ch.reject(this._msg, requeue);
  }
}

module.exports = ConsumeThen;