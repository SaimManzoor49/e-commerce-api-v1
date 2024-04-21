import mongoose, { Document } from "mongoose";

export interface CartType extends Document {
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}