const chai = require('chai');
const expect = chai.expect;
const PRMQ = require( './index' );
const prmq = new PRMQ('amqp://localhost');

describe("exchange()", function() {

  before(function() {
    return prmq.deleteExchange('test_exchange', ['test_queue'])
  });

  it('create and receive message', function(done) {

    prmq.exchange('test_exchange', 'fanout')
      .then(function(exchange) {
        return prmq.queue('test_queue')
          .then(function(test_queue) {
            return test_queue
              .assert()
              .then(function(){ return test_queue.bindWithExchange(exchange) })
              .then(function(){
                test_queue.onMessage(function(message){
                  console.log(message)
                  done();
                });
              })
          })
          .then(function(){
            exchange.publish({test: 'test message 1'});
          })
        });

  })
});