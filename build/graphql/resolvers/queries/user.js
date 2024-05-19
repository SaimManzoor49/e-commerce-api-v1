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
exports.Query = void 0;
// import { Resolvers } from './generated/graphql';
const user_model_1 = require("../../../model/user.model");
const apiResponse_1 = require("../../../utils/apiResponse");
const apiError_1 = require("../../../utils/apiError");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const Query = {
    getUser(parent, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, id } = args;
            if ((!email || email.length < 4) &&
                (!username || username.length < 2) &&
                (!id || id.length < 6)) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Username, email or id is required");
            }
            const user = yield user_model_1.User.findOne({
                $or: [{ email }, { username }, { _id: new mongoose_1.default.Types.ObjectId(id) }],
            }).select("-password -refreshToken");
            if (!user) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
            }
            return new apiResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, user, "User found");
        });
    }
};
exports.Query = Query;
