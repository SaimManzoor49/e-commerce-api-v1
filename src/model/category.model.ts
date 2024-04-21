import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    }
}, { timestamps: true })

export const Category = model("Category", categorySchema)