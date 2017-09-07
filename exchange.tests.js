const chai = require('chai');
const expect = chai.expect;
const PRMQ = require('./index');
const prmq = new PRMQ('amqp://localhost');

describe("exchange()", function() {

  before(function() {
    return prmq.deleteExchange('test_exchange', ['test_queue'])
  });

  it('create and receive message', function(done) {
    prmq.exchange('test_exchange')
      .then(function(exchange) {
        exchange.subscribe("test_queue", function(message, ack) {
          expect(message.test).to.eq('test message');
          ack();
          done();
        })
          .then(function(){
            return exchange.publish({
              test: 'test message'
            });
          })
      });
  })
});