import mongoose from "mongoose";
import { Document } from "mongoose";

export  interface ProductType extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    category: mongoose.Types.ObjectId;
    quantity: number;
    shipping?: boolean;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}