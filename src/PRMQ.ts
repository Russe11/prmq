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

import {connect, Connection} from 'amqplib';

import {ChannelConf} from './channel/ChannelConf';
import {ChannelNConf} from './channel/ChannelNConf';

const debug = require('debug')('http');

export interface PRMQChannelOptions {
  connectionString?: string;
  connection?: Connection;
  prefetch?: number;
  logResults?: boolean;
}

/**
 * Create a new Channel
 * @param {PRMQChannelOptions} options
 * @returns {Promise<ChannelNConf>}
 */
export async function channel(options: PRMQChannelOptions = {}) {
  const conn = await createConnection(options);

  let ch = await conn.createChannel();
  ch.on('error', async (err) => {
    debug('Channel Error %o', err.message);
    ch = await conn.createChannel();
  });
  await prefetch(ch, options);
  return new ChannelNConf(ch, conn, options.logResults);
}

export async function confirmChannel(options: PRMQChannelOptions = {}) {
  const conn = await createConnection(options);
  let ch = await conn.createConfirmChannel();
  ch.on('error', async (err) => {
    debug('Channel Error %o', err.message);
    ch = await conn.createConfirmChannel();
  });
  await prefetch(ch, options);
  return new ChannelConf(ch, conn, options.logResults);
}

export async function createConnection(options: PRMQChannelOptions) {
  if (process.env.PRMQ_LOG === 'true') {
    options.logResults = true;
  }
  if (options.connection) {
    return await options.connection;
  } else {
    return await connect(options.connectionString);
  }
}

async function prefetch(ch: any, options: PRMQChannelOptions) {
  if (options.prefetch) {
    await ch.prefetch(options.prefetch);
  }
}
