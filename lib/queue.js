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

  async exec() {
    if (this._shouldAssert) {
      this._q = await this._ch.assertQueue(this._queueName, this._options);
    }

    this._binds.forEach(async (b) => {
      await this._ch.bindQueue(this._q.queue, b.exchangeName, b.routing)
    });

    this._consumers.forEach((c) => {
      if (c.noAck === true && c.raw === false) {
        this._consume(c.cb);
      } else if (c.noAck === false && c.raw === false) {
        this._consumeWithAck(c.cb);
      } else if (c.noAck === true && c.raw === true) {
        this._consumeRaw(c.cb);
      } else if (c.noAck === false && c.raw === true) {
        this._consumeRawWithAck(c.cb);
      }
    });

    this._sends.forEach(async (s) => {
      let msg = typeof s.message === 'string' ? s.message : JSON.stringify(s.message);
      await this._ch.sendToQueue(this._q.queue, Buffer.from(msg), s.options);
    });

    return this;
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
    this._sends.push({ message: message, options});
  }

  bind(exchange, routing) {
    this._binds.push({ exchangeName: exchange._exchangeName, routing});
    return this;
  }

  bindWithRoutings(exchange, routings) {
    routings.forEach(routing => {
      this._binds.push({ exchangeName: exchange._exchangeName, routing});
    });
    return this;
  }

  /**
   * @param {string} routing
   * @returns {<Replies.Empty> | void | {queue, exchange, routing, arguments, ticket, nowait}}
   */
  bindWithRouting(exchange, routing) {
    this._binds.push({ exchangeName: exchange._exchangeName, routing});
    return this;
  }

  consume(cb) {
    this._consumers.push({noAck: true, raw: false, cb});
    return this;
  }

  consumeAndExec(cb) {
    this._consumers.push({noAck: true, raw: false, cb});
    return this.exec();
  }


  consumeRaw(cb) {
    this._consumers.push({noAck: true, raw: true, cb});
    return this;
  }

  consumeWithAck(cb) {
    this._consumers.push({noAck: false, raw: false, cb});
    return this;
  }

  consumeRawWithAck(cb) {
    this._consumers.push({noAck: false, raw: true, cb});
    return this;
  }


  _consume(cb) {
    this._ch.consume(this._q.queue, msg => {
      if (msg !== null) {
        const content = msg.content.toString();
        cb(content.startsWith('{') ? JSON.parse(content) : content)
      }
    }, { noAck: true });
    return this;
  }


  _consumeWithAck(cb) {
    this._ch.consume(this._q.queue, msg => {
      if (msg !== null) {
        const content = msg.content.toString();
        cb(
          content.startsWith('{') ? JSON.parse(content) : content,
          new ConsumeThen(this._ch, msg)
        )
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
