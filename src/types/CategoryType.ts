import { Document,  } from "mongoose";

export interface CategoryType extends Document {
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}