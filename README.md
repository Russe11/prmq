[![npm](https://img.shields.io/npm/v/prmq.svg)](https://www.npmjs.com/package/prmq)
[![Build Status](https://travis-ci.org/Russe11/prmq.svg?branch=master)](https://travis-ci.org/Russe11/prmq)
[![Dependency Status](https://gemnasium.com/badges/github.com/Russe11/prmq.svg)](https://gemnasium.com/github.com/Russe11/prmq)
[![codecov](https://codecov.io/gh/Russe11/prmq/branch/master/graph/badge.svg)](https://codecov.io/gh/Russe11/prmq)
[![DeepScan Grade](https://deepscan.io/api/projects/461/branches/710/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=461&bid=710)

# PRMQ
### Promise based amqplib wrapper For RabbitMQ and Javascript

 *Based on https://github.com/squaremo/amqp.node by Michael Bridgen*

**This project is still under heavy development and the API will likely change.
Compatible with Node.js v6 or higher**

## Usage



All promise chains are queued until ```.exec``` is called at the end.

So this will not have any affect:

``` javascript
ch.queue('hello')
  .consume((msg) => { });
```

until you add ```.exec()```

``` javascript
ch.queue('hello')
  .consume((msg) => { })
  .exec();
```



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
https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

Sending
``` Javascript
ch.queue('hello')
  .consume((msg) => {
    console.log("msg");
  })
  .exec();
```

Receiving
```
ch.queue('hello')
  .send('Hello World!')
  .exec();
```

### Worker

https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

``` Javascript
const ch = await prmq.channel(1);
await ch.queue('task_queue')
  .consumeWithAck((msg, then) => {
    console.log(msg);
    then.ack();
  })
  .send('Hello World!', { persistant: true })
  .exec();
```

### Publish/Subscribe

https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html

``` Javascript
const ex = await ch.exchangeFanout('logs').go();

await ch.queue('')
  .bind(ex)
  .consume((msg) => {
    console.log(msg);
  })
  .exec()

await ex.publish('Hello World')
  .exec();

```

### Routing

``` Javascript
const ex = await ch.exchangeFanout('logs').go();

await ch.queue('')
  .bind(ex)
  .consume((msg) => {
    console.log(msg);
  })
  .exec();

await ex.publish('Hello World')
  .exec();

```

### Topics
https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

``` Javascript
const ex = await ch.exchangeTopic('topic', {durable: false})
  .exec();

await ch.queue('', { exclusive: true })
  .bindWithRouting(ex, 'kern.*')
  .consumeRaw(msg => {
    console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
  })
  .exec();

await ex.publishWithRoutingKey('A critical kernel error', 'kern.critical')
  .exec();

```

## Todo
* RPC Support
* API Docs
* JSDoc code
* Typescript Support

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
