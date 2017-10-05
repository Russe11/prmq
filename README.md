[![npm](https://img.shields.io/npm/v/prmq.svg)](https://www.npmjs.com/package/prmq)
[![Build Status](https://travis-ci.org/Russe11/prmq.svg?branch=master)](https://travis-ci.org/Russe11/prmq)
[![Dependency Status](https://gemnasium.com/badges/github.com/Russe11/prmq.svg)](https://gemnasium.com/github.com/Russe11/prmq)
[![codecov](https://codecov.io/gh/Russe11/prmq/branch/master/graph/badge.svg)](https://codecov.io/gh/Russe11/prmq)
[![DeepScan Grade](https://deepscan.io/api/projects/461/branches/710/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=461&bid=710)

# PRMQ
### Promise based amqplib wrapper For RabbitMQ and Javascript

[![Greenkeeper badge](https://badges.greenkeeper.io/Russe11/prmq.svg)](https://greenkeeper.io/)

 *Based on https://github.com/squaremo/amqp.node by Michael Bridgen*

**This project is still under heavy development and the API will likely change.
Compatible with Node.js v6 or higher**

#### Changelog 

#####v0.6.0:

  * Exchanges and Queues are now resolvable using the promise pattern
  * exec() is no longer required. Just resolve the chain.
  * RPC is supported
 


#### Initialization

``` Javascript 
const PRMQ = require('prmq');
```

With connection string
``` Javascript
const ch = await PRMQ.channel({connectionString: 'amqp://localhost'});
```

With connection object
``` Javascript
const conn = await PRMQ.createConnection({connectionString: 'amqp://localhost' });
const ch = await PRMQ.channel({connection: conn});
```

Closing a connection once done
``` Javascript 
await ch.close();
```



#### Hello World
https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html

Sending
``` Javascript
ch.queue('hello')
  .consume((msg) => {
    console.log("msg");
  })
```

Receiving
```
ch.queue('hello')
  .send('Hello World!');
```

### Worker

https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

``` Javascript
const ch = await prmq.channel({prefetch: 1});
await ch.queue('task_queue')
  .consumeWithAck((msg, then) => {
    console.log(msg);
    return then.ack();
  })
  .send('Hello World!', { persistant: true });
```

### Publish/Subscribe
https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html

``` Javascript
const ch = await prmq.channel();
const ex = ch.exchangeFanout('logs');
await ch.queue()
  .bind(ex)
  .consume((msg) => {
    console.log(msg);
  });
await ex.publish('Hello World');

```

### Routing
https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html

``` Javascript
const ch = await prmq.channel();
const ex = ch.exchangeDirect('prmq_logs');
await ch.queue('', { exclusive: true })
  .bindWithRoutings(ex, [
    'info',
    'warning',
    'error',
  ])
  .consumeRaw((msg) => {
    console.log(msg.fields.routingKey, msg.content.toString());
  });

await ex.publishWithRoutingKey(msg, severity);
```

### Topics
https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

``` Javascript
const ch = await prmq.channel({prefetch: 1});
const ex = ch.exchangeTopic('topic', {durable: false});
await ch.queue('', { exclusive: true })
  .bindWithRouting(ex, 'kern.*')
  .consumeRaw(msg => {
    console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
  });
await ex.publishWithRoutingKey('A critical kernel error', 'kern.critical');

```

### RPC
https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html

``` Javascript
PRMQ.channel({ prefetch: 1 })
  .then(async (ch) => {

    const q1 = await ch.queue('prmq_rpc_queue', { durable: false })
      .consumeRawWithAck(async (msg, then) => {
        console.log(msg.content.toString());
        then.ack();
        await ch.queueWithoutAssert(msg.properties.replyTo)
          .send('2nd message', {correlationId: msg.properties.correlationId});
      });

    const corr = Math.random().toString();

    const q2 = await ch.queue('', {exclusive: true})
      .consumeRaw((msg) => {
        if (msg.properties.correlationId == corr) {
           console.log(msg.content.toString());
          return ch.close();
        }
      });

    await q1.send('1st message', {correlationId: corr, replyTo: q2.queueName})
  })
```

## Todo
* API Docs
* JSDoc code

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
