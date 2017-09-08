# PRMQ
### Promise based amqplib wrapper For RabbitMQ and Javascript

--

#### Based on https://github.com/squaremo/amqp.node by Michael Bridgen

--

This software is very much very still in development with current only support for the PubSub pattern

### Current compatible with Node 4 or higher.

## Usage

To create a basic PubSub exchange

``` Javascript
const PRMQ = require('prmq');
const prmq = new PRMQ('amqp://localhost');

// Create Exchange on RabbitMQ
prmq.exchange('test_exchange', 'fanout')
  .then(ex =>
  
    // Create Queueon RabbitMQ
    prmq.queue('test_queue')
      .then(q => P.join(

        // Bind created queue with created exchange
        q.bindWithExchange(ex),

        // Specify what happens when a message is sent to queue
        q.onMessageWithAck(processMessage),
      ))

      // Publish a message to the exchange to test
      .then(() => ex.publish({ test: 'test message 1' })));

const processMessage = (message, ack) => {
  expect(JSON.parse(message).test).to.eq('test message 1');
  ack();
};

```

## License

Copyright (c) 2017 Russell Lewis
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
// SOFTWARE.
