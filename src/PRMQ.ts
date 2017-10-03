// Copyright (c) 2017 Russell Lewis (russlewis@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * PRMQ Library
 */

import * as amqp from 'amqplib';

import {ChannelConf} from './channel/ChannelConf';
import {ChannelNConf} from './channel/ChannelNConf';

const debug = require('debug')('http');

/**
 * Create a RabbitMQ channel
 */
export async function channel(connectionString?: string, prefetch?: number, logResults?: boolean) {

  if (process.env.PRMQ_LOG === 'true') {
    logResults = true;
  }

  const conn = await amqp.connect(connectionString);
  let ch = await conn.createChannel();
  ch.on('error', async (err) => {
    debug('Channel Error %o', err.message);
    ch = await conn.createChannel();
  });
  if (prefetch) {
    await ch.prefetch(prefetch);
  }
  return new ChannelNConf(ch, logResults);
}

export async function confirmChannel(connectionString?: string, prefetch?: number, logResults?: boolean) {

  if (process.env.PRMQ_LOG === 'true') {
    logResults = true;
  }

  const conn = await amqp.connect(connectionString);
  let ch = await conn.createConfirmChannel();
  ch.on('error', async (err) => {
    debug('Channel Error %o', err.message);
    ch = await conn.createConfirmChannel();
  });
  if (prefetch) {
    await ch.prefetch(prefetch);
  }
  return new ChannelConf(ch, logResults);
}
