"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * PRMQ Channel
 */
var QueueNConf_1 = require("../queue/QueueNConf");
var ExchangeBase_1 = require("../exchange/ExchangeBase");
var ChannelBase_1 = require("./ChannelBase");
var ExchangeNConf_1 = require("../exchange/ExchangeNConf");
var ChannelNConf = /** @class */ (function (_super) {
    __extends(ChannelNConf, _super);
    function ChannelNConf(channel) {
        return _super.call(this, channel) || this;
    }
    ChannelNConf.prototype.queue = function (queueName, options) {
        var q = new QueueNConf_1.QueueNConf(this.ch, queueName, options);
        return q.assert();
    };
    ChannelNConf.prototype.exchange = function (exchangeName, exchangeType, options) {
        var ex = new ExchangeNConf_1.ExchangeNConf(this.ch, exchangeName, exchangeType, options);
        return ex.assert();
    };
    /**
     * Create an exchange with 'direct' type
     */
    ChannelNConf.prototype.exchangeDirect = function (exchangeName, options) {
        if (this.closed) {
            ChannelBase_1.ChannelBase.throwClosedChannel();
        }
        return this.exchange(exchangeName, ExchangeBase_1.ExchangeTypes.Direct, options);
    };
    /**
     * Create an exchange with 'fanout' type
     */
    ChannelNConf.prototype.exchangeFanout = function (exchangeName, options) {
        if (this.closed) {
            ChannelBase_1.ChannelBase.throwClosedChannel();
        }
        return this.exchange(exchangeName, ExchangeBase_1.ExchangeTypes.Fanout, options);
    };
    /**
     * Create an exchange with 'topic' type
     */
    ChannelNConf.prototype.exchangeTopic = function (exchangeName, options) {
        if (options === void 0) { options = {}; }
        if (this.closed) {
            ChannelBase_1.ChannelBase.throwClosedChannel();
        }
        return this.exchange(exchangeName, ExchangeBase_1.ExchangeTypes.Topic, options);
    };
    return ChannelNConf;
}(ChannelBase_1.ChannelBase));
exports.ChannelNConf = ChannelNConf;
