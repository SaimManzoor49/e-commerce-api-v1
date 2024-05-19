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
exports.Mutation = void 0;
// import { Resolvers } from './generated/graphql';
const user_model_1 = require("../../../model/user.model");
const apiResponse_1 = require("../../../utils/apiResponse");
const apiError_1 = require("../../../utils/apiError");
const http_status_codes_1 = require("http-status-codes");
const generateRefreshToken_1 = __importDefault(require("../../../utils/generateRefreshToken"));
const generateAccessToken_1 = __importDefault(require("../../../utils/generateAccessToken"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEmail_1 = require("../../../utils/validateEmail");
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
};
const Mutation = {
    // Implementation
    registerUser: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, email, password } = args.input;
            if (!username || username.trim().length <= 2) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Username should have at least 3 characters");
            }
            if (!email || email.trim().length <= 0) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email is required");
            }
            if (!password || password.trim().length < 6) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wrong Password");
            }
            const emailFormat = (0, validateEmail_1.validateEmailFormate)(email);
            if (!emailFormat) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wrong email address");
            }
            const existingUser = yield user_model_1.User.findOne({ $or: [{ email }, { username }] });
            if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.username) === username) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.CONFLICT, "Username already taken");
            }
            if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) === email) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.CONFLICT, "Email already taken");
            }
            // Create the user
            const newUser = yield user_model_1.User.create({ username, email, password });
            newUser.password = "";
            newUser.refreshToken = "";
            return new apiResponse_1.ApiResponse(http_status_codes_1.StatusCodes.CREATED, newUser, "User registered successfully");
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }),
    loginUser(parent, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, username, password } = args.input;
                if ((!email || email.trim().length <= 0) && (!username || username.trim().length <= 0))
                    throw new Error("Email or Username is required");
                if (!password || password.trim().length <= 0)
                    throw new Error("Password is required");
                const user = yield user_model_1.User.findOne({ $or: [{ email }, { username }] });
                if (!user)
                    throw new Error("Wrong email or username");
                const isAuth = yield user.isPasswordCorrect(password);
                if (!isAuth)
                    throw new Error("Wrong password");
                const refreshToken = yield (0, generateRefreshToken_1.default)(user._id);
                const accessToken = yield (0, generateAccessToken_1.default)({
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                });
                user.refreshToken = refreshToken;
                yield user.save({ validateBeforeSave: false });
                // Assuming you have a method to remove sensitive fields from user
                const sanitizedUser = user.toJSON();
                delete sanitizedUser.password;
                // delete sanitizedUser.refreshToken;
                sanitizedUser.accessToken = accessToken;
                // manage cookies
                // res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                // res.cookie("accessToken", accessToken, COOKIE_OPTIONS);
                // setCookies.push({ name: "refreshToken", value: refreshToken, options: COOKIE_OPTIONS });
                // setCookies.push({ name: "accessToken", value: accessToken, options: COOKIE_OPTIONS });
                return new apiResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, sanitizedUser, "Loged in Successfully");
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        });
    },
    logoutUser(parent, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation
        });
    },
    refreshAccessToken(parent, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = args;
            if (!refreshToken)
                throw new Error("Refresh token is required");
            const { _id } = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const currentUser = yield user_model_1.User.findById(_id);
            if (!currentUser)
                throw new Error("Invalid refresh token");
            if (currentUser.refreshToken !== refreshToken)
                throw new Error("Invalid refresh token");
            const newAccessToken = yield (0, generateAccessToken_1.default)({
                _id: currentUser._id,
                email: currentUser.email,
                username: currentUser.username,
            });
            const newRefreshToken = yield (0, generateRefreshToken_1.default)(currentUser._id);
            currentUser.refreshToken = newRefreshToken;
            yield currentUser.save({ validateBeforeSave: false });
            //  manage cookies
            //   res.cookie("accessToken", newAccessToken, COOKIE_OPTIONS);
            //   res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
            return new apiResponse_1.ApiResponse(http_status_codes_1.StatusCodes.CREATED, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Token updated");
        });
    },
    resetPassword(parent, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation
        });
    },
    resetPasswordVerify(parent, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation
        });
    },
    changePassword(parent, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation
        });
    },
    getUserData(parent, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = args.token;
            const decodedData = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            delete decodedData.iat;
            delete decodedData.exp;
            decodedData.accessToken = token;
            const data = decodedData;
            console.log(decodedData);
            return new apiResponse_1.ApiResponse(200, data, "Successfully");
        });
    }
};
exports.Mutation = Mutation;
