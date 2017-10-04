/**
 * Examples tests
 */

import {expect} from 'chai';
import * as PRMQ from '../PRMQ';

describe('Examples', () => {

  beforeEach( async() => {

    const ch = await PRMQ.channel();
    await ch.deleteExchangesAndQueues([
      'prmq_logs',
      'prmq_topic',
    ], [
      'prmq_task_queue',
      'prmq_logs',
      'prmq_hello',
    ]);
  });

  it('HelloWorld', (done) => {
    PRMQ.channel({ logResults: true })
      .then(async (ch) => {
        await ch.queue('prmq_hello')
          .consume(async (msg) => {
            expect(msg).eq('Hello World!');
            await ch.close();
            done();
          })
          .send('Hello World!')
          .exec();
      });
  });

  it('Worker', (done) => {
    PRMQ.channel({ logResults: true, prefetch: 1})
      .then(async (ch) => {
        await ch.queue('prmq_task_queue')
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
    PRMQ.channel()
      .then(async (ch) => {
        const ex = await ch.exchangeFanout('prmq_logs').exec();
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
    PRMQ.channel()
      .then(async (ch) => {
        const ex = await ch.exchangeDirect('prmq_logs').exec();
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
    PRMQ.channel()
      .then(async (ch) => {
        const ex = await ch.exchangeTopic('prmq_topic', { durable: false }).exec();
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

