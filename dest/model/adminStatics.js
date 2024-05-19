"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStatistic = void 0;
const mongoose_1 = require("mongoose");
const AdminStatisticSchema = new mongoose_1.Schema({
    event: [
        {
            date: String,
            clicksNumber: {
                type: Number,
                default: 0,
            },
            buysNumber: {
                type: Number,
                default: 0,
            },
            buysSumNumber: {
                type: Number,
                default: 0,
            },
        },
    ],
    buysMonth: {
        type: Number,
        default: 0,
    },
    buysSumMonth: {
        type: Number,
        default: 0,
    },
    clicksMonth: {
        type: Number,
        default: 0,
    },
    clicksAllPeriod: {
        type: Number,
        default: 0,
    },
    buysAllPeriod: {
        type: Number,
        default: 0,
    },
    buysSumAllPeriod: {
        type: Number,
        default: 0,
    },
    conversionAllPeriod: {
        type: Number,
        default: 0,
    },
    lastSevenDaysConversions: [
        {
            date: String,
            number: Number,
        },
    ],
    chartsMonth: {
        buys: [
            {
                date: String,
                number: Number,
                quantity: {
                    type: Number,
                    default: 0
                }
            },
        ],
        clicks: [
            {
                date: String,
                number: Number,
            },
        ],
        conversions: [
            {
                date: String,
                number: Number,
            },
        ],
    },
    chartsYear: {
        buys: [
            {
                date: String,
                number: Number,
                quantity: {
                    type: Number,
                    default: 0
                }
            },
        ],
        clicks: [
            {
                date: String,
                number: Number,
            },
        ],
        conversions: [
            {
                date: String,
                number: Number,
            },
        ],
    },
    chartsYearAllPeriod: {
        buys: [
            {
                date: String,
                number: Number,
                quantity: {
                    type: Number,
                    default: 0
                }
            },
        ],
        clicks: [
            {
                date: String,
                number: Number,
            },
        ],
        conversions: [
            {
                date: String,
                number: Number,
            },
        ],
    },
}, { timestamps: true });
exports.AdminStatistic = (0, mongoose_1.model)("AdminStatistic", AdminStatisticSchema);
