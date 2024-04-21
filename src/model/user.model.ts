import mongoose from "mongoose";
import bcrypt from 'bcrypt'
export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: [String],
      enum: ["user", "seller", "admin"],
      default: ["user"],
    },
    orderHistory: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        products: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
            quantity: {
              type: Number,
            },
          },
        ],
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          default: "Pending",
        },
        total: {
          type: Number,
        },
      },
    ],
    Image: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
    },
    accountStatus: {
      type: String,
      enum: ["Active", "Suspended", "Blocked"],
      default: "Active",
    },
    shop: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true, }
);

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}


userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

export const User = mongoose.model("User", userSchema);
