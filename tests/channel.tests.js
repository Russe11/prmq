/* eslint-disable no-unused-vars,no-console,import/no-extraneous-dependencies,padded-blocks,prefer-destructuring */
require('babel-polyfill');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;
const PRMQ = require('../index');

const prmq = new PRMQ('amqp://localhost');

describe('Channels', () => {

  describe('queue()', () => {
    it('should setup a queue', () =>
      prmq.channel()
        .then(ch => ch.queue('prmqTestQueue', { durable: true }))
        .then((q) => {
          expect(q.getName()).to.eq('prmqTestQueue');
          expect(q.isDurable()).to.be.true;
        }));

    it('should queue up a assertion on a queue', () =>
      prmq.channel()
        .then((ch) => {
          const shouldAssert = ch.queue('prmqTestQueue', { durable: true })._shouldAssert;
          expect(shouldAssert).to.be.true;
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
          expect(ex.isFanoutExchange()).to.be.true;
        }));
  });

  describe('exchangeDirect()', () => {
    it('should setup a exchange with type = direct', () =>
      prmq.channel()
        .then(ch => ch.exchangeDirect('prmqTestExchange'))
        .then((ex) => {
          expect(ex.getName()).to.equal('prmqTestExchange');
          expect(ex.isDirectExchange()).to.be.true;
        }));
  });

  describe('exchangeTopic()', () => {
    it('should setup a exchange with type = topic', () =>
      prmq.channel()
        .then(ch => ch.exchangeTopic('prmqTestExchange'))
        .then((ex) => {
          expect(ex.getName()).to.equal('prmqTestExchange');
          expect(ex.isTopicExchange()).to.be.true;
        }));
  });

  describe('close()', () => {
    it('should close the channel', async () => {
      const ch = await prmq.channel();
      await ch.close();
      expect(ch.isClosed()).to.be.true;
    });
  });

  describe('checkQueue()', () => {

    beforeEach(async () => {
      const ch = await prmq.channel();
      return ch.deleteQueues([
        'prmqCheckQueue',
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
      const ch = await prmq.channel();
      const q = await ch.queue('prmqCheckQueue');
      await q.exec();
      expect(ch.checkQueue('prmqCheckQueueNotExist')).to.be.rejected;
    });
  });
});

