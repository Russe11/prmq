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

const amqp = require('amqplib');
const P = require('bluebird');
const Channel = require('./lib/channel');

class PRMQ {
  /**
   * @param {string} connectionString
   */
  constructor(connectionString) {
    this._open = amqp.connect(connectionString);
  }

  /**
   * Create a RabbitMQ channel
   * @param {number} prefetch
   */
  channel(prefetch) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const conn = yield _this._open;
      const ch = yield conn.createChannel();
      if (prefetch) {
        ch.prefetch(prefetch);
      }
      return new Channel(ch);
    })();
  }

  /**
   * Remove exchange and queues from RabbitMQ
   * @param {string} exchangeName
   * @param {string[]?} queues
   */
  deleteExchangesAndQueues(exchanges, queues = []) {

    return this._open.then(conn => conn.createChannel()).then(ch => P.map(queues, queue => ch.deleteQueue(queue)).then(() => P.map(exchanges, exchange => ch.deleteExchange(exchange))));
  }

}

module.exports = PRMQ;