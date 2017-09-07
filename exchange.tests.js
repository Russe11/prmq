const P = require('bluebird');
const chai = require('chai');
const expect = chai.expect;
const PRMQ = require('./index');
const prmq = new PRMQ('amqp://localhost');

describe("exchange()", function() {

  before(function() {
    return prmq.deleteExchange('test_exchange', ['test_queue'])
  });

  it('create and receive message', function(done) {

    const processMessage = (message, ack) => {
      expect(JSON.parse(message).test).to.eq('test message 1');
      ack();
      done();
    };

    prmq.exchange('test_exchange', 'fanout')
      .then(ex =>
        prmq.queue('test_queue')
          .then(q => P.join(
            q.bindWithExchange(ex),
            q.onMessageWithAck(processMessage),
          ))
          .then(() => ex.publish({ test: 'test message 1' })));
  });
});
