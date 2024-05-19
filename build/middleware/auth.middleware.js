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
exports.verifyAdminRole = exports.verifyJWT = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiError_1 = require("../utils/apiError");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../model/user.model");
exports.verifyJWT = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // const token = req.cookies?.accessToken || req.header("Authorization")?.split("Bearer")[1];
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.split("Bearer ")[1]);
    if (!token)
        throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized request");
    const decodedData = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedData || !decodedData._id)
        throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized");
    const user = yield user_model_1.User.findById(decodedData._id).select("-password -refreshToken");
    if (!user)
        throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid access token");
    req.body.user = user;
    next();
}));
exports.verifyAdminRole = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.user;
    try {
        // if (!user || user.role[0] !== 'admin') {
        const isAdmin = !!user.role.find((r) => (r === 'admin'));
        if (!isAdmin)
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, "Insufficient permissions");
        // }
        next();
    }
    catch (error) {
        throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, "Insufficient permissions");
    }
}));
