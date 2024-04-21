import mongoose,{ Document } from "mongoose";

export interface OrderType extends Document {
    product: mongoose.Types.ObjectId[];
    payment: any; // Update this with the actual payment schema
    buyer: mongoose.Types.ObjectId;
    seller?: mongoose.Types.ObjectId;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
    createdAt: Date;
    updatedAt: Date;
}