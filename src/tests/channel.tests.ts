/* eslint-disable no-unused-vars,no-console,import/no-extraneous-dependencies,padded-blocks,prefer-destructuring */

/**
 * PRMQChannel Tests
 */

import {} from 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {PRMQ} from '../lib/PRMQ';

chai.use(chaiAsPromised);
const expect = chai.expect;

let prmq;

describe('Channels', () => {

  before(() => {
    prmq  = new PRMQ('amqp://localhost');
  });

  describe('queue()', () => {
    it('should setup a queue', () =>
      prmq.channel()
        .then(ch => ch.queue('prmqTestQueue', { durable: true }))
        .then((q) => {
          expect(q.queueName).to.eq('prmqTestQueue');
          expect(q.isDurable()).to.eq(true);
        }));

    it('should queue up a assertion on a queue', () =>
      prmq.channel()
        .then((ch) => {
          const q = ch.queue('prmqTestQueue', { durable: true });
          expect(q.shouldAssert).to.eq(true);
        }));

    it('should create a queue on RabbitMQ server', async () => {
      const ch = await prmq.channel();
      const q = ch.queue('prmqTestQueue');
      await q.exec();
      await q.check();
      await ch.deleteQueue('prmqTestQueue');
    });
  });

  describe('exchangeFanout()', () => {
    it('should setup a exchange with type = fanout', () =>
      prmq.channel()
        .then(ch => ch.exchangeFanout('prmqTestExchange'))
        .then((ex) => {
          expect(ex.getName()).to.equal('prmqTestExchange');
          expect(ex.isFanoutExchange()).to.eq(true);
        }));
  });

  describe('exchangeDirect()', () => {
    it('should setup a exchange with type = direct', () =>
      prmq.channel()
        .then(ch => ch.exchangeDirect('prmqTestExchange'))
        .then((ex) => {
          expect(ex.getName()).to.equal('prmqTestExchange');
          expect(ex.isDirectExchange()).to.eq(true);
        }));
  });

  describe('exchangeTopic()', () => {
    it('should setup a exchange with type = topic', () =>
      prmq.channel()
        .then(ch => ch.exchangeTopic('prmqTestExchange'))
        .then((ex) => {
          expect(ex.getName()).to.equal('prmqTestExchange');
          expect(ex.isTopicExchange()).to.eq(true);
        }));
  });

  describe('close()', () => {
    it('should close the channel', async () => {
      const ch = await prmq.channel();
      await ch.close();
      expect(ch.isClosed()).to.eq(true);
    });
  });

  describe('checkQueue()', () => {

    beforeEach(async () => {
      const ch = await prmq.channel();
      return ch.deleteQueues([
        'prmqCheckQueue'
      ]);
    });

    it('should confirm a queue exists by Queue object', async () => {
      const ch = await prmq.channel();
      const q = await ch.queue('prmqCheckQueue');
      await q.exec();
      await ch.checkQueue(q);
    });

    it('should confirm a queue exists by queue name', async () => {
      const ch = await prmq.channel();
      const q = await ch.queue('prmqCheckQueue');
      await q.exec();
      await ch.checkQueue('prmqCheckQueue');
    });

    it('should throw an error when a Queue object does not exist', async () => {
      let ch = await prmq.channel();
      const q = await ch.queue('prmqCheckQueue');
      await q.exec();
      expect(ch.checkQueue('prmqQueueNotExist')).to.be.rejected;
    });
  });
});
