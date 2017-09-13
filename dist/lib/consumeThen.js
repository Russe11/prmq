"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConsumeThen = function () {
  function ConsumeThen(ch, msg) {
    _classCallCheck(this, ConsumeThen);

    this._ch = ch;
    this._msg = msg;
  }

  /**
   * Acknowledge the message - Channel#ack
   */


  _createClass(ConsumeThen, [{
    key: "ack",
    value: function ack() {
      this._ch.ack(this._msg);
    }

    /**
     * Reject a message - Channel#nack
     */

  }, {
    key: "nack",
    value: function nack() {
      var requeue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this._ch.nack(this._msg, requeue);
    }

    /**
     * Reject a message - Channel#reject
     */

  }, {
    key: "reject",
    value: function reject() {
      var requeue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this._ch.reject(this._msg, requeue);
    }
  }]);

  return ConsumeThen;
}();

module.exports = ConsumeThen;