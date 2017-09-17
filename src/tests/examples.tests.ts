/* eslint-disable no-unused-vars,no-console,import/no-extraneous-dependencies,padded-blocks */

import {} from 'mocha';
import * as P from 'bluebird';
import { expect } from 'chai';
import { PRMQ } from '../index'

const prmq = new PRMQ('amqp://localhost');

describe('Examples', () => {

  beforeEach(() => P.join(prmq.deleteExchangesAndQueues([
    'test_exchange',
    'logs',
    'topic',
    'direct_logs',
  ], [
    'test_queue',
    'task_queue',
    'logs',
    'hello',
  ])));

  it('HelloWorld', (done) => {
    prmq.channel()
      .then(async (ch) => {
        await ch.queue('hello')
          .consume((msg) => {
            expect(msg).eq('Hello World!');
            done();
          })
          .send('Hello World!')
          .exec();
      });
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
            }, 100);
          })
          .send('Hello World!', { persistent: true })
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
        await ch.queue('', { exclusive: true })
          .bindWithRoutings(ex, [
            'info',
            'warning',
            'error',
          ])
          .consumeRaw((msg) => {
            expect(msg.fields.routingKey).to.eq('info');
            expect(msg.content.toString()).to.eq('Hello World!');
            done();
          }).exec();

        await ex.publishWithRoutingKey(msg, severity)
          .exec();
      });
  });

  it('Topics', (done) => {

    prmq.channel()
      .then(async (ch) => {
        const ex = await ch.exchangeTopic('topic', { durable: false }).exec();
        await ch.queue('', { exclusive: true })
          .bindWithRouting(ex, 'kern.*')
          .consumeRaw((msg) => {
            expect(msg.fields.routingKey).to.equal('kern.critical');
            expect(msg.content.toString().toString()).to.equal('A critical kernel error');
            done();
          }).exec();
        return await ex.publishWithRoutingKey('A critical kernel error', 'kern.critical')
          .exec();
      });


  });

});

