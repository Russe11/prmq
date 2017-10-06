/**
 * Examples tests
 */

import {expect} from 'chai';
import * as PRMQ from '../PRMQ';

describe('Connection', () => {


  it('should create channel using connection string', async () => {
    const ch = await PRMQ.channel({ connectionString: 'amqp://localhost' });
    expect(ch.isClosed()).to.be.false;
    await ch.close();
  });

  it('should create channel using connection object', async () => {
    const conn = await PRMQ.createConnection({connectionString: 'amqp://localhost' });
    const ch = await PRMQ.channel({ connection: conn });
    await ch.queue('prmq_queue_1')
      .assert();
    expect(ch.isClosed()).to.be.false;
    await ch.close();
  });


});

