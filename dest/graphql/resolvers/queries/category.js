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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const http_status_codes_1 = require("http-status-codes");
const category_model_1 = require("../../../model/category.model");
const apiError_1 = require("../../../utils/apiError");
const Query = {
    getAllCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allCategories = yield category_model_1.Category.find();
            return allCategories;
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch categories', error);
        }
    }),
    getSingleCategory: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { slug }) {
        try {
            const singleCategory = yield category_model_1.Category.findOne({ slug });
            if (!singleCategory) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No category found');
            }
            return singleCategory;
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch category', error);
        }
    }),
};
exports.Query = Query;
