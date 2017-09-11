# PRMQ
### Promise based amqplib wrapper For RabbitMQ and Javascript

 *Based on https://github.com/squaremo/amqp.node by Michael Bridgen*

** This project is still under heavy development and the API will likely change.**

## Usage

#### Initialization
``` Javascript
const PRMQ = require('prmq');
const prmq = new PRMQ('amqp://localhost');
const ch = await prmq.channel();
```

### Hello World
https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

Sending
``` Javascript
ch.queue('hello')
  .consumeAndGo((msg) => {
    console.log("msg");
  });
```

Receiving
```
ch.queue('hello')
  .sendAndGo('Hello World!');
```

### Worker

https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

``` Javascript
const ch = await prmq.channel(1);
await ch.queue('task_queue')
  .consumeWithAck((msg, ack) => {
    console.log(msg);
    ack();
  })
  .sendPersistent('Hello World!')
  .go();
```

### Publish/Subscribe

https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html

``` Javascript
const ex = await ch.exchangeFanout('logs').go();

await ch.queue('')
  .bind(ex)
  .consumeAndGo((msg) => {
    console.log(msg);
  });

await ex.publishAndGo('Hello World');

```

### Routing

``` Javascript
const ex = await ch.exchangeFanout('logs').go();

await ch.queue('')
  .bind(ex)
  .consumeAndGo((msg) => {
    console.log(msg);
  });

await ex.publishAndGo('Hello World');

```

## Todo
* Topics
* RPC

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
