import mongoose, { Schema, model } from "mongoose";

const partnerStatisticSchema = new Schema(
    {
        partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        event: [
            {
                date: String,
                clicks: [String],
                buys: [
                    {
                        date: String,
                        value: Number,
                        buyId: String
                    }
                ],
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
    },
    { timestamps: true }
);

export const PartnerStatistic = model("PartnerStatistic", partnerStatisticSchema);
