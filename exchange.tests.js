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
    prmq.channel()
      .then(async (ch) => {
        await ch.queue('hello')
          .consume((msg) => {
            expect(msg).eq('Hello World!');
            done();
          })
          .sendAndExec('Hello World!');
      })
  });

  it('Worker', (done) => {
    prmq.channel(1)
      .then(async (ch) => {
        await ch.queue('task_queue')
          .consumeWithAck((msg, then) => {
            setTimeout(() => {
              expect(msg).to.eq('Hello World!');
              then.ack();
              done();
            })
          })
          .sendPersistent('Hello World!')
          .exec();
      });
  });

  it('PubSub', (done) => {

    prmq.channel()
      .then(async (ch) => {
        const ex = await ch.exchangeFanout('logs').exec();

        await ch.queue('')
          .bind(ex)
          .consume((msg) => {
            expect(msg).to.eq('Hello World');
            done();
          })
          .exec();

        await ex.publish('Hello World').exec();
      });

  });

  it('Routing', (done) => {
    const msg = 'Hello World!';
    const severity = 'info';
    prmq.channel()
      .then(async (ch) => {
        const ex = await ch.exchangeDirect('logs').exec();
        await ch.queueExclusive('')
          .bindWithRoutings(ex, [
            'info',
            'warning',
            'error'
          ])
          .consumeRaw((msg) => {
            console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            done();
          }).exec();

        await ex.publishWithRouteAndExec(msg, severity);
      })
  });

  it('Topics', (done) => {

    prmq.channel()
      .then(async (ch) => {
        const ex = await ch.exchangeTopic('topic', {durable: false}).exec();
        console.log(ex);
        await ch.queueExclusive('')
          .bindWithRouting(ex, 'kern.*')
          .consumeRaw(msg => {
            expect(msg.fields.routingKey).to.equal('kern.critical');
            expect(msg.content.toString().toString()).to.equal('A critical kernel error');
            done();
          }).exec();
        return await ex.publishWithKeyAndExec('A critical kernel error', 'kern.critical');
      });


  })

});

