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
      .then(async (ch) =>
        ch.queue('prmq_hello')
          .consume(async (msg) => {
            expect(msg).eq('Hello World!');
            await ch.close();
            done();
          })
          .send('Hello World!')
      );
  });

  it('Worker', (done) => {
    PRMQ.channel({ logResults: true, prefetch: 1})
      .then(async (ch) =>
        ch
          .queue('prmq_task_queue')
          .consumeWithAck(async (msg, then) => {
            expect(msg).to.eq('Hello World!');
            done();
            return then.ack();
          })
          .send('Hello World!', { persistent: true })
        );
  });

  it('PubSub', (done) => {
    PRMQ.channel()
      .then(async (ch) => {
        const ex = await ch.exchangeFanout('prmq_logs');
        await ch.queue('')
          .bind(ex)
          .consume((msg) => {
            expect(msg).to.eq('Hello World');
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
        console.log(1);

        const ex = await ch.exchangeDirect('prmq_logs');

        console.log(2)

        const res = await ch.queue('', { exclusive: true })
          .bindWithRoutings(ex, [
            'info',
            'warning',
            'error',
          ])
          .consumeRaw((msg) => {
            console.log("CONSUME");
            expect(msg.fields.routingKey).to.eq('info');
            expect(msg.content.toString()).to.eq('Hello World!');
            done();
          });

        console.log(res, 3)

        await ex.publishWithRoutingKey(msg, severity);
      });
  });

  it('Topics', (done) => {
    PRMQ.channel()
      .then(async (ch) => {

        const ex = await ch.exchangeTopic('prmq_topic', { durable: false });
        await ch.queue('', { exclusive: true })
          .bindWithRouting(ex, 'kern.*')
          .consumeRaw((msg) => {
            expect(msg.fields.routingKey).to.equal('kern.critical');
            expect(msg.content.toString().toString()).to.equal('A critical kernel error');
            done();
          });

        return await ex.publishWithRoutingKey('A critical kernel error', 'kern.critical');
      });
  });
});

