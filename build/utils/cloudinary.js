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
exports.deleteUploadedImageFromCloudinary = exports.uploadImagesOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const http_status_codes_1 = require("http-status-codes");
const fs_1 = __importDefault(require("fs"));
const apiError_1 = require("./apiError");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadImagesOnCloudinary = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!localFilePath) {
        console.error("No local path provided.");
        return null;
    }
    try {
        const result = yield cloudinary_1.v2.uploader.upload(localFilePath, { resource_type: 'image' });
        fs_1.default.unlinkSync(localFilePath);
        return result;
    }
    catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        fs_1.default.unlinkSync(localFilePath);
        throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Something went wrong while uploading the image.");
    }
});
exports.uploadImagesOnCloudinary = uploadImagesOnCloudinary;
const deleteUploadedImageFromCloudinary = (uploadedLink, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!uploadedLink) {
            fs_1.default.unlinkSync(localFilePath);
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Uploaded link not provided.");
        }
        const result = yield cloudinary_1.v2.uploader.destroy(uploadedLink);
        if (result.result !== 'ok') {
            fs_1.default.unlinkSync(localFilePath);
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, `Error deleting image from Cloudinary: ${result.result}`);
        }
        // console.log("Image deleted successfully from Cloudinary:", result);
    }
    catch (error) {
        fs_1.default.unlinkSync(localFilePath);
        console.error("Error deleting image from Cloudinary:", error.message);
        throw error;
    }
});
exports.deleteUploadedImageFromCloudinary = deleteUploadedImageFromCloudinary;
