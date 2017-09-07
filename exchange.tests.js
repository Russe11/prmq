const chai = require('chai');
const expect = chai.expect;
const PRMQ = require('./index');
const prmq = new PRMQ('amqp://localhost');

describe("prmq.exchange", function() {
  it('create and receive message', function(done) {
    prmq.createExchange('test_exchange')
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