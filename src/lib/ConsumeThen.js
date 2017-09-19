"use strict";
/**
 * PRMQ Consume Then
 */
exports.__esModule = true;
var ConsumeThen = /** @class */ (function () {
    function ConsumeThen(ch, msg) {
        this.ch = ch;
        this.msg = msg;
    }
    /**
     * Acknowledge the message - Channel#ack
     */
    ConsumeThen.prototype.ack = function () {
        this.ch.ack(this.msg);
    };
    /**
     * Reject a message - Channel#nack
     */
    ConsumeThen.prototype.nack = function (requeue) {
        if (requeue === void 0) { requeue = false; }
        this.ch.nack(this.msg, requeue);
    };
    /**
     * Reject a message - Channel#reject
     */
    ConsumeThen.prototype.reject = function (requeue) {
        if (requeue === void 0) { requeue = false; }
        this.ch.reject(this.msg, requeue);
    };
    return ConsumeThen;
}());
exports.ConsumeThen = ConsumeThen;
