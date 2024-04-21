import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema({
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true,
        },
    ],
    payment: {},
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending',
        // required: true, // already has default value
    },
}, { timestamps: true })

export const Order = model("Order", orderSchema)