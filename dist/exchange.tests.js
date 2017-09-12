'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-unused-vars,no-console,import/no-extraneous-dependencies,padded-blocks */
const P = require('bluebird');
const { expect } = require('chai');
const PRMQ = require('./index');

const prmq = new PRMQ('amqp://localhost');

describe('Examples', () => {

  beforeEach(() => P.join(prmq.deleteExchangesAndQueues(['test_exchange', 'logs', 'topic', 'direct_logs'], ['test_queue', 'task_queue', 'logs', 'hello'])));

  it('HelloWorld', done => {
    prmq.channel().then((() => {
      var _ref = _asyncToGenerator(function* (ch) {
        yield ch.queue('hello').consume(function (msg) {
          expect(msg).eq('Hello World!');
          done();
        }).sendAndExec('Hello World!');
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
  });

  it('Worker', done => {
    prmq.channel(1).then((() => {
      var _ref2 = _asyncToGenerator(function* (ch) {
        yield ch.queue('task_queue').consumeWithAck(function (msg, then) {
          setTimeout(function () {
            expect(msg).to.eq('Hello World!');
            then.ack();
            done();
          });
        }).sendPersistent('Hello World!').exec();
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
  });

  it('PubSub', done => {

    prmq.channel().then((() => {
      var _ref3 = _asyncToGenerator(function* (ch) {
        const ex = yield ch.exchangeFanout('logs').exec();

        yield ch.queue('').bind(ex).consume(function (msg) {
          expect(msg).to.eq('Hello World');
          done();
        }).exec();

        yield ex.publish('Hello World').exec();
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
  });

  it('Routing', done => {
    const msg = 'Hello World!';
    const severity = 'info';
    prmq.channel().then((() => {
      var _ref4 = _asyncToGenerator(function* (ch) {
        const ex = yield ch.exchangeDirect('logs').exec();
        yield ch.queueExclusive('').bindWithRoutings(ex, ['info', 'warning', 'error']).consumeRaw(function (msg) {
          console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
          done();
        }).exec();

        yield ex.publishWithRouteAndExec(msg, severity);
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })());
  });

  it('Topics', done => {

    prmq.channel().then((() => {
      var _ref5 = _asyncToGenerator(function* (ch) {
        const ex = yield ch.exchangeTopic('topic', { durable: false }).exec();
        yield ch.queueExclusive('').bindWithRouting(ex, 'kern.*').consumeRaw(function (msg) {
          expect(msg.fields.routingKey).to.equal('kern.critical');
          expect(msg.content.toString().toString()).to.equal('A critical kernel error');
          done();
        }).exec();
        return yield ex.publishWithKeyAndExec('A critical kernel error', 'kern.critical');
      });

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    })());
  });
});