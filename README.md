# PRMQ
### Promise Based AMPQ Wrapper For RabbitMQ and Javascript
This software is very much very still in development with current only support for the PubSub pattern

### Only compatible with Node 4+

## Usage

To create a basic PubSub exchange

``` Javascript
const PRMQ = require('prmq');
const prmq = new PRMQ('amqp://localhost');

// Create an exchange
prmq.createExchange('exchange_name')

  .then((exchange) => {

    // Create a queue and bind it to the exchange
    exchange.subscribe('queue_name', (message, ack) => {
      console.log(message);
      // Ack the message
      ack();
    })

  });

// Publish to exchange
prmq.exchange('exchange_name')
  .then((exchange) => exchange.publish({data: "test message"}));
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
