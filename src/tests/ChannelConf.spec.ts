/**
 * PRMQChannel Tests
 */

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as PRMQ from '../PRMQ';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('ChannelConf()', () => {

  beforeEach( async() => {

    const ch = await PRMQ.channel();
    await ch.deleteExchangesAndQueues([
      'prmqTestExchange',
      'prmqTestFanoutExchange',
      'prmqTestDirectExchange',
      'prmqTestTopicExchange',
    ], [
      'prmqTestQueue',
      'prmqCheckQueue'

    ]);
    await ch.close()
  });

  describe('queue()', () => {

    it('should create a queue on RabbitMQ server', async () => {
      const ch = await PRMQ.confirmChannel();
      const q = ch.queue('prmqTestQueue');
      await q.exec();
      await q.check();
      await ch.deleteQueue('prmqTestQueue');
      await ch.close();
    });
  });

  describe('exchangeFanout()', () => {
    it('should setup a exchange with type = fanout', () =>
      PRMQ.confirmChannel()
        .then(ch => ch.exchangeFanout('prmqTestExchange'))
        .then(async(ex) => {
          expect(ex.getName()).to.equal('prmqTestExchange');
          expect(ex.isFanoutExchange()).to.eq(true);
          await ex.channel.connection.close();
        }));
  });

  describe('exchangeDirect()', () => {
    it('should setup a exchange with type = direct', () =>
      PRMQ.confirmChannel()
        .then(ch => ch.exchangeDirect('prmqTestExchange'))
        .then((ex) => {
          expect(ex.getName()).to.equal('prmqTestExchange');
          expect(ex.isDirectExchange()).to.eq(true);
          return ex.channel.connection.close();
        }));
  });

  describe('exchangeTopic()', () => {
    it('should setup a exchange with type = topic', () =>
      PRMQ.confirmChannel()
        .then(ch => ch.exchangeTopic('prmqTestExchange'))
        .then((ex) => {
          expect(ex.getName()).to.equal('prmqTestExchange');
          expect(ex.isTopicExchange()).to.eq(true);
          return ex.channel.connection.close();
        }));
  });

  describe('close()', () => {
    it('should close the channel', async () => {
      const ch = await PRMQ.confirmChannel();
      await ch.close();
      expect(ch.isClosed()).to.eq(true);
    });
  });

  describe('checkQueue()', () => {

    it('should confirm a queue exists by Queue object', async () => {
      const ch = await PRMQ.confirmChannel();
      const q = await ch.queue('prmqCheckQueue');
      await q.exec();
      await ch.checkQueue(q);
      await ch.close();
    });

    it('should confirm a queue exists by queue name', async () => {
      const ch = await PRMQ.confirmChannel();
      const q = await ch.queue('prmqCheckQueue');
      await q.exec();
      await ch.checkQueue('prmqCheckQueue');
      await ch.close();
    });

    it('should throw an error when a Queue object does not exist', async () => {
      const ch = await PRMQ.confirmChannel();
      const q = await ch.queue('prmqCheckQueue');
      await q.exec();
      expect(ch.checkQueue('prmqQueueNotExist')).to.be.rejected;
      await ch.close();
    });
  });
});
