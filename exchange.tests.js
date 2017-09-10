/* eslint-disable no-unused-vars,no-console,import/no-extraneous-dependencies,padded-blocks */
const P = require('bluebird');
const {expect} = require('chai');
const PRMQ = require('./index');

const prmq = new PRMQ('amqp://localhost');

describe('Examples', () => {

  beforeEach(() => P.join(prmq.deleteExchangesAndQueues(
    [
      'test_exchange',
      'logs',
      'direct_logs'
    ], [
      'test_queue',
      'task_queue',
      'logs',
      'hello',
    ]
  )));

  it('HelloWorld', (done) => {

    // Setup Receiver
    prmq.queue('hello')
      .then((q) => {
        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q._queueName);
        q.consume((msg) => {
          console.log(' [x] Received %s', msg);
          expect(msg).to.eq('Hello World!');
          done();
        });
      })
      .then(() => prmq.sendToQueue('hello', 'Hello World!'));
  });

  it.only('HelloWorldCompact', (done) => {

    prmq.queue('hello')
      .consume((msg) => {
        expect(msg).to.eq('Hello World!');
        done();
      })
      .sendToQueue('Hello World!')

    //
    // prmq.queue('hello')
    //   .then((q) => {
    //     q.consume((msg) => {
    //       expect(msg).to.eq('Hello World!');
    //       done();
    //     });
    //     q.sendToQueue('Hello World!');
    //   })
  });

  it('Worker', (done) => {

    const newTask = prmq.queue('task_queue')
      .then((q) => {
        const msg = process.argv.slice(2).join(' ') || "Hello World!";
        q.sendToQueuePersistent(msg);
        console.log(" [x] Sent '%s'", msg);
      });

    const workerTask = prmq.queue('task_queue')
      .then((q) => {
        q.prefetch(1);
        q.consumeWithAck((msg, ack) => {
          console.log(msg);
          const secs = msg.split('.').length - 1;
          console.log(" [x] Received %s", msg);
          setTimeout(() => {
            expect(msg).to.contain('exchange.tests.js');
            console.log(" [x] Done");
            ack();
            done();
          }, secs * 1000);
        })
      });

    newTask.then(() => workerTask);

  });

  it('PubSub', (done) => {

    prmq.exchangeFanout('logs')
      .then((ex) => {
        return prmq.queueExclusive('')
          .then((q) => {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q._queueName);
            q.bind(ex);
            q.consume((msg) => {
              console.log(" [x] %s", msg);
              done();
            })
          })
          .then(() => {
            const args = process.argv.slice(2);
            const severity = (args.length > 0) ? args[0] : 'info';
            const msg = args.slice(1).join(' ') || 'Hello World!';
            ex.publish(msg);
            console.log(" [x] Sent %s: '%s'", severity, msg);
          })
      });

  });

  it('Routing', (done) => {

    prmq.exchangeDirect('direct_logs')
      .then((ex) => {
        return prmq.queueExclusive('')
          .then((q) => {
            const args = [
              'info',
              'warning',
              'error'
            ];
            const msg = 'Hello World!';
            const severity = 'info';
            args.forEach((severity) => {
              q.bindWithRouting(ex, severity);
            });
            q.consumeRaw((msg) => {
              console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
              done();
            });
            ex.publishWithRoute(msg, severity);
          })
      })
  })
});

