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
const product_model_1 = require("../../../model/product.model");
const apiError_1 = require("../../../utils/apiError");
const Query = {
    getAllProducts: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { page = 1, limit = 10 }) {
        try {
            const query = {};
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                customLabels: {
                    totalDocs: 'totalItems',
                    docs: 'products',
                    totalPages: 'totalPages',
                    nextPage: 'next',
                    prevPage: 'prev',
                    pagingCounter: 'pagingCounter',
                    hasPrevPage: 'hasPrev',
                    hasNextPage: 'hasNext',
                },
            };
            const result = yield product_model_1.Product.aggregatePaginate(query, options);
            return result;
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, error);
        }
    }),
    getSingleProduct: (_2, _b) => __awaiter(void 0, [_2, _b], void 0, function* (_, { slug }) {
        try {
            const singleProduct = yield product_model_1.Product.findOne({ slug });
            if (!singleProduct)
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No product found');
            return singleProduct;
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch product', error);
        }
    }),
    filterProduct: (_3, _c) => __awaiter(void 0, [_3, _c], void 0, function* (_, { category, minPrice, maxPrice }) {
        try {
            const query = {};
            if (category)
                query.category = category;
            if (minPrice !== undefined && !isNaN(minPrice))
                query.price = { $gte: minPrice };
            if (maxPrice !== undefined && !isNaN(maxPrice)) {
                if (query.price)
                    query.price.$lte = maxPrice;
                else
                    query.price = { $lte: maxPrice };
            }
            const products = yield product_model_1.Product.find(query);
            return products;
        }
        catch (error) {
            console.log(error);
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve products', error);
        }
    }),
    searchProducts: (_4, _d) => __awaiter(void 0, [_4, _d], void 0, function* (_, { keyword }) {
        try {
            if (!keyword || !keyword.trim())
                throw new Error('Please enter a valid keyword.');
            const results = yield product_model_1.Product.find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                ],
            });
            return results;
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve products', error);
        }
    })
};
exports.Query = Query;
