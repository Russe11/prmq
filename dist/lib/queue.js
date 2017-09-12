'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copyright (c) 2017 Russell Lewis (russlewis@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var ConsumeThen = require('./consumeThen');

var Queue = function () {
  function Queue(ch, queueName, options) {
    _classCallCheck(this, Queue);

    this._ch = ch;
    this._queueName = queueName;
    this._options = options;
    this._shouldAssert = false;
    this._sends = [];
    this._consumers = [];
    this._binds = [];
  }

  _createClass(Queue, [{
    key: 'exec',
    value: async function exec() {
      var _this = this;

      if (this._shouldAssert) {
        this._q = await this._ch.assertQueue(this._queueName, this._options);
      }

      this._binds.forEach(async function (b) {
        await _this._ch.bindQueue(_this._q.queue, b.exchangeName, b.routing);
      });

      this._consumers.forEach(function (c) {
        if (c.noAck === true && c.raw === false) {
          _this._consume(c.cb);
        } else if (c.noAck === false && c.raw === false) {
          _this._consumeWithAck(c.cb);
        } else if (c.noAck === true && c.raw === true) {
          _this._consumeRaw(c.cb);
        } else if (c.noAck === false && c.raw === true) {
          _this._consumeRawWithAck(c.cb);
        }
      });

      this._sends.forEach(async function (s) {
        var msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
        await _this._ch.sendToQueue(_this._q.queue, Buffer.from(msg), s.options);
      });

      return this;
    }
  }, {
    key: 'assert',
    value: function assert() {
      this._shouldAssert = true;
      return this;
    }
  }, {
    key: 'send',
    value: function send(message) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options.persistent = options.persistent || false;
      this._send(message, options);
      return this;
    }
  }, {
    key: 'sendAndExec',
    value: function sendAndExec(message) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options.persistent = options.persistent || false;
      this._send(message, options);
      return this.exec();
    }
  }, {
    key: 'sendPersistent',
    value: function sendPersistent(message) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options.persistent = options.persistent || true;
      this._send(message, options);
      return this;
    }
  }, {
    key: '_send',
    value: function _send(message, options) {
      this._sends.push({ message: message, options: options });
    }
  }, {
    key: 'bind',
    value: function bind(exchange, routing) {
      this._binds.push({ exchangeName: exchange._exchangeName, routing: routing });
      return this;
    }
  }, {
    key: 'bindWithRoutings',
    value: function bindWithRoutings(exchange, routings) {
      var _this2 = this;

      routings.forEach(function (routing) {
        _this2._binds.push({ exchangeName: exchange._exchangeName, routing: routing });
      });
      return this;
    }

    /**
     * @param {string} routing
     * @returns {<Replies.Empty> | void | {queue, exchange, routing, arguments, ticket, nowait}}
     */

  }, {
    key: 'bindWithRouting',
    value: function bindWithRouting(exchange, routing) {
      this._binds.push({ exchangeName: exchange._exchangeName, routing: routing });
      return this;
    }
  }, {
    key: 'consume',
    value: function consume(cb) {
      this._consumers.push({ noAck: true, raw: false, cb: cb });
      return this;
    }
  }, {
    key: 'consumeAndExec',
    value: function consumeAndExec(cb) {
      this._consumers.push({ noAck: true, raw: false, cb: cb });
      return this.exec();
    }
  }, {
    key: 'consumeRaw',
    value: function consumeRaw(cb) {
      this._consumers.push({ noAck: true, raw: true, cb: cb });
      return this;
    }
  }, {
    key: 'consumeWithAck',
    value: function consumeWithAck(cb) {
      this._consumers.push({ noAck: false, raw: false, cb: cb });
      return this;
    }
  }, {
    key: 'consumeRawWithAck',
    value: function consumeRawWithAck(cb) {
      this._consumers.push({ noAck: false, raw: true, cb: cb });
      return this;
    }
  }, {
    key: '_consume',
    value: function _consume(cb) {
      this._ch.consume(this._q.queue, function (msg) {
        if (msg !== null) {
          var content = msg.content.toString();
          cb(content.startsWith('{') ? JSON.parse(content) : content);
        }
      }, { noAck: true });
      return this;
    }
  }, {
    key: '_consumeWithAck',
    value: function _consumeWithAck(cb) {
      var _this3 = this;

      this._ch.consume(this._q.queue, function (msg) {
        if (msg !== null) {
          var content = msg.content.toString();
          cb(content.startsWith('{') ? JSON.parse(content) : content, new ConsumeThen(_this3._ch, msg));
        }
      }, { noAck: false });
    }
  }, {
    key: '_consumeRaw',
    value: function _consumeRaw(cb) {
      var _this4 = this;

      this._ch.consume(this._q.queue, function (msg) {
        return cb(msg, function () {
          _this4._ch.ack(msg);
        });
      }, { noAck: true });
      return this;
    }
  }, {
    key: '_consumeRawWithAck',
    value: function _consumeRawWithAck(cb) {
      var _this5 = this;

      this._ch.consume(this._q.queue, function (msg) {
        return cb(msg, function () {
          _this5._ch.ack(msg);
        });
      }, { noAck: false });
      return this;
    }
  }, {
    key: 'prefetch',
    value: function prefetch(count) {
      this._ch.prefetch(count);
      return this;
    }
  }]);

  return Queue;
}();

module.exports = Queue;