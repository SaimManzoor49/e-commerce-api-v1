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
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("../../../utils/apiError");
const category_model_1 = require("../../../model/category.model");
const slugify_1 = __importDefault(require("slugify"));
const Mutation = {
    addCategory: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name }) {
        if (!name || name.trim().length < 3) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Name should have at least 3 characters');
        }
        const findExistingCategory = yield category_model_1.Category.findOne({ name });
        if (findExistingCategory) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Category already exists');
        }
        try {
            const category = yield category_model_1.Category.create({ name, slug: (0, slugify_1.default)(name) });
            return category;
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create category', error);
        }
    }),
    updateCategory: (_2, _b) => __awaiter(void 0, [_2, _b], void 0, function* (_, { id, name }) {
        if (!name || name.trim().length < 3) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Enter the new name of category');
        }
        try {
            const updateCategory = yield category_model_1.Category.findByIdAndUpdate(id, { name, slug: (0, slugify_1.default)(name) }, { new: true });
            if (!updateCategory) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update category');
            }
            return updateCategory;
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update category', error);
        }
    }),
    deleteCategory: (_3, _c) => __awaiter(void 0, [_3, _c], void 0, function* (_, { id }) {
        if (!id) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please select the category you want to delete');
        }
        try {
            const deleteCategory = yield category_model_1.Category.findByIdAndDelete(id);
            if (!deleteCategory) {
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to delete category');
            }
            return { status: http_status_codes_1.StatusCodes.OK, message: 'Category deleted successfully' };
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete category', error);
        }
    }),
};
exports.Mutation = Mutation;
