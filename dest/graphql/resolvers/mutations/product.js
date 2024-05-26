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
const product_model_1 = require("../../../model/product.model");
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("../../../utils/apiError");
const cloudinary_1 = require("../../../utils/cloudinary");
const mailer_1 = require("../../../utils/mailer");
const wishlist_model_1 = require("../../../model/wishlist.model");
const slugify_1 = __importDefault(require("slugify"));
const category_model_1 = require("../../../model/category.model");
const Mutation = {
    createProduct: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, description, price, quantity, shipping, category, imageUrl }) {
        var _b;
        const categoryId = yield (category_model_1.Category.find({ name: category }));
        const slug = (0, slugify_1.default)(name);
        console.log(imageUrl);
        // const imageUrl = await uploadImagesOnCloudinary(image.path);
        try {
            const product = yield product_model_1.Product.create({
                name,
                slug,
                description,
                price,
                quantity,
                shipping,
                image: imageUrl,
                category: (_b = categoryId[0]) === null || _b === void 0 ? void 0 : _b._id,
            });
            return product;
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, error);
        }
    }),
    updateProduct: (_2, _c) => __awaiter(void 0, [_2, _c], void 0, function* (_, { id, name, description, price, quantity, shipping, category, image }) {
        var _d;
        const product = yield product_model_1.Product.findById(id);
        const oldQuantity = product.quantity;
        if (!product)
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found');
        try {
            if (name) {
                product.name = name;
                product.slug = (0, slugify_1.default)(name);
            }
            if (description)
                product.description = description;
            if (price)
                product.price = price;
            if (quantity && quantity != product.quantity)
                product.quantity = quantity;
            if (shipping)
                product.shipping = shipping;
            if (category)
                product.category = category;
            if (image) {
                if (product.image) {
                    const publicId = (_d = product.image.split('/').pop()) === null || _d === void 0 ? void 0 : _d.split('.')[0];
                    if (publicId)
                        yield (0, cloudinary_1.deleteUploadedImageFromCloudinary)(publicId, image.path);
                }
                const imageUrl = yield (0, cloudinary_1.uploadImagesOnCloudinary)(image.path);
                if (imageUrl)
                    product.image = imageUrl.url;
            }
            const updatedProduct = yield product.save();
            // Handle stock update mail notification here
            if (oldQuantity > 0 && updatedProduct.quantity <= 0) {
                // notify out of stock
                const wishlists = yield wishlist_model_1.Wishlist.find({
                    products: id,
                }).populate(["user", "products"]);
                wishlists.map((w) => ((0, mailer_1.stockUpdatesMailer)({ email: w.user.email, product: updatedProduct, avaliablity: false })));
            }
            else if (oldQuantity <= 0 && updatedProduct.quantity > 0) {
                // notify stock is avaliable
                const wishlists = yield wishlist_model_1.Wishlist.find({
                    products: id,
                }).populate(["user", "products"]);
                wishlists.map((w) => ((0, mailer_1.stockUpdatesMailer)({ email: w.user.email, product: updatedProduct, avaliablity: true })));
            }
            return updatedProduct;
        }
        catch (error) {
            console.log(error);
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update product', error);
        }
    }),
    deleteProduct: (_3, _e) => __awaiter(void 0, [_3, _e], void 0, function* (_, { id }) {
        try {
            const deleteProduct = yield product_model_1.Product.findByIdAndDelete(id);
            if (deleteProduct)
                return { status: http_status_codes_1.StatusCodes.OK, message: 'Product deleted successfully' };
            else
                throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to delete product');
        }
        catch (error) {
            throw new apiError_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete product', error);
        }
    }),
};
exports.Mutation = Mutation;
