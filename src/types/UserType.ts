import mongoose, { Document } from "mongoose";


export interface UserType extends Document {
  username: string;
  fullName?: string;
  email: string;
  password: string;
  role: ("user" | "seller" | "admin")[];
  orderHistory: {
      orderId: mongoose.Types.ObjectId;
      products: {
          productId: mongoose.Types.ObjectId;
          quantity: number;
      }[];
      date: Date;
      status: string;
      total: number;
  }[];
  Image?: string;
  phoneNumber?: string;
  address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
  };
  accountStatus: "Active" | "Suspended" | "Blocked";
  shop?: mongoose.Types.ObjectId[];
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
}

