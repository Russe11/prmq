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

class Queue {
    constructor(ch, queueName, options) {
        this._ch = ch;
        this._queueName = queueName;
        this._options = options;

    }

    assert() {
        return this._ch.assertQueue(this._queueName, this._options)
            .then(q => {
                this._q = q;
            })
    }

    bindWithExchange(exchange) {
        return this._ch.bindQueue(this._q.queue, exchange._exchangeName, this._queueName);
    }

    onMessage(cb) {
        this._ch.consume(this._q.queue, (msg) => {
            return cb(msg.content.toString());
        }, { noAck: true });
    }

    onMessageRaw(cb) {
        this._ch.consume(this._q.queue, (msg) => {
            return cb(msg);
        }, { noAck: true });
    }


    onMessageWithAck(cb) {
        this._ch.consume(q.queue, (msg) => {
            return cb(msg, () => {
                this._ch.ack(msg.content.toString())
            })
        }, { noAck: false });
    }

    onMessageRawWithAck(cb) {
        this._ch.consume(q.queue, (msg) => {
            return cb(msg, () => {
                this._ch.ack(msg)
            })
        }, { noAck: false });
    };

}

module.exports = Queue;