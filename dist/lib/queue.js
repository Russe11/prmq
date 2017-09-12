'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

const ConsumeThen = require('./consumeThen');

class Queue {
  constructor(ch, queueName, options) {
    this._ch = ch;
    this._queueName = queueName;
    this._options = options;
    this._shouldAssert = false;
    this._sends = [];
    this._consumers = [];
    this._binds = [];
  }

  exec() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this._shouldAssert) {
        _this._q = yield _this._ch.assertQueue(_this._queueName, _this._options);
      }

      _this._binds.forEach((() => {
        var _ref = _asyncToGenerator(function* (b) {
          yield _this._ch.bindQueue(_this._q.queue, b.exchangeName, b.routing);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());

      _this._consumers.forEach(function (c) {
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

      _this._sends.forEach((() => {
        var _ref2 = _asyncToGenerator(function* (s) {
          let msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
          yield _this._ch.sendToQueue(_this._q.queue, Buffer.from(msg), s.options);
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      })());

      return _this;
    })();
  }

  assert() {
    this._shouldAssert = true;
    return this;
  }

  send(message, options = {}) {
    options.persistent = options.persistent || false;
    this._send(message, options);
    return this;
  }

  sendAndExec(message, options = {}) {
    options.persistent = options.persistent || false;
    this._send(message, options);
    return this.exec();
  }

  sendPersistent(message, options = {}) {
    options.persistent = options.persistent || true;
    this._send(message, options);
    return this;
  }

  _send(message, options) {
    this._sends.push({ message: message, options });
  }

  bind(exchange, routing) {
    this._binds.push({ exchangeName: exchange._exchangeName, routing });
    return this;
  }

  bindWithRoutings(exchange, routings) {
    routings.forEach(routing => {
      this._binds.push({ exchangeName: exchange._exchangeName, routing });
    });
    return this;
  }

  /**
   * @param {string} routing
   * @returns {<Replies.Empty> | void | {queue, exchange, routing, arguments, ticket, nowait}}
   */
  bindWithRouting(exchange, routing) {
    this._binds.push({ exchangeName: exchange._exchangeName, routing });
    return this;
  }

  consume(cb) {
    this._consumers.push({ noAck: true, raw: false, cb });
    return this;
  }

  consumeAndExec(cb) {
    this._consumers.push({ noAck: true, raw: false, cb });
    return this.exec();
  }

  consumeRaw(cb) {
    this._consumers.push({ noAck: true, raw: true, cb });
    return this;
  }

  consumeWithAck(cb) {
    this._consumers.push({ noAck: false, raw: false, cb });
    return this;
  }

  consumeRawWithAck(cb) {
    this._consumers.push({ noAck: false, raw: true, cb });
    return this;
  }

  _consume(cb) {
    this._ch.consume(this._q.queue, msg => {
      if (msg !== null) {
        const content = msg.content.toString();
        cb(content.startsWith('{') ? JSON.parse(content) : content);
      }
    }, { noAck: true });
    return this;
  }

  _consumeWithAck(cb) {
    this._ch.consume(this._q.queue, msg => {
      if (msg !== null) {
        const content = msg.content.toString();
        cb(content.startsWith('{') ? JSON.parse(content) : content, new ConsumeThen(this._ch, msg));
      }
    }, { noAck: false });
  }

  _consumeRaw(cb) {
    this._ch.consume(this._q.queue, msg => cb(msg, () => {
      this._ch.ack(msg);
    }), { noAck: true });
    return this;
  }

  _consumeRawWithAck(cb) {
    this._ch.consume(this._q.queue, msg => cb(msg, () => {
      this._ch.ack(msg);
    }), { noAck: false });
    return this;
  }

  prefetch(count) {
    this._ch.prefetch(count);
    return this;
  }
}

module.exports = Queue;