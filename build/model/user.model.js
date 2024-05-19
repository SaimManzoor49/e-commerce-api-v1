"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.userSchema = new mongoose_1.default.Schema({
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
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Order",
            },
            products: [
                {
                    productId: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Shop",
        },
    ],
    refreshToken: {
        type: String,
    },
}, { timestamps: true, });
exports.userSchema.methods.isPasswordCorrect = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
exports.userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 10);
        next();
    });
});
exports.User = mongoose_1.default.model("User", exports.userSchema);
