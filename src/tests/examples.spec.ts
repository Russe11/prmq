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
      'prmq_topic'
    ], [
      'prmq_task_queue',
      'prmq_logs',
      'prmq_hello',
      'prmq_rpc_queue'
    ]);
    await ch.close();
  });

  it('HelloWorld', (done) => {
    PRMQ.channel({ logResults: true })
      .then(async (ch) =>
        ch.queue('prmq_hello')
          .consume(async (msg) => {
            expect(msg).eq('Hello World!');
            await ch.close();
            return done();
          })
          .send('Hello World!')
      );
  });

  it('Worker', (done) => {
    PRMQ.channel({ logResults: true, prefetch: 1})
      .then(async (ch) =>
        ch.queue('prmq_task_queue')
          .consumeWithAck(async (msg, then) => {
            expect(msg).to.eq('Hello World!');
            then.ack();
            await ch.close();
            done();
          })
          .send('Hello World!', { persistent: true })
        );
  });

  it('PubSub', (done) => {
    PRMQ.channel()
      .then(async (ch) => {
        const ex = ch.exchangeFanout('prmq_logs');
        await ch.queue()
          .bind(ex)
          .consume(async(msg) => {
            expect(msg).to.eq('Hello World');
            await ch.close();
            done();
          });
        await ex.publish('Hello World');
      });
  });

  it('Routing', (done) => {
    const msg = 'Hello World!';
    const severity = 'info';
    PRMQ.channel()
      .then(async (ch) => {

        const ex = ch.exchangeDirect('prmq_logs');
        await ch.queue('', { exclusive: true })
          .bindWithRoutings(ex, [
            'info',
            'warning',
            'error',
          ])
          .consumeRaw(async (msg) => {
            expect(msg.fields.routingKey).to.eq('info');
            expect(msg.content.toString()).to.eq('Hello World!');
            await ch.close();
            done();
          });

        await ex.publishWithRoutingKey(msg, severity);
      });
  });

  it('Topics', (done) => {
    PRMQ.channel()
      .then(async (ch) => {

        const ex = ch.exchangeTopic('prmq_topic', { durable: false });
        await ch.queue('', { exclusive: true })
          .bindWithRouting(ex, 'kern.*')
          .consumeRaw(async(msg) => {

            expect(msg.fields.routingKey).to.equal('kern.critical');
            expect(msg.content.toString().toString()).to.equal('A critical kernel error');
            await ch.close();
            done();
          });

        return await ex.publishWithRoutingKey('A critical kernel error', 'kern.critical');
      });
  });

  it('RPC', (done) => {
    PRMQ.channel({ prefetch: 1 })
      .then(async (ch) => {

        const q1 = await ch.queue('prmq_rpc_queue', { durable: false })
          .consumeRawWithAck(async (msg, then) => {
            then.ack();
            expect(msg.content.toString()).to.eq('1st message');
            await ch.queueWithoutAssert(msg.properties.replyTo)
              .send('2nd message', {correlationId: msg.properties.correlationId})
          });

        const corr = Math.random().toString();

        const q2 = await ch.queue('', {exclusive: true})
          .consumeRaw(async (msg) => {
            if (msg.properties.correlationId === corr) {
              await ch.close();
              done();
            }
          });

        await q1.send('1st message', {correlationId: corr, replyTo: q2.queueName})
      });
  });
});

