
import { Product } from '../../../model/product.model';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../../../utils/apiResponse';
import { ApiError } from '../../../utils/apiError';
import { deleteUploadedImageFromCloudinary, uploadImagesOnCloudinary } from '../../../utils/cloudinary';
import { stockUpdatesMailer } from '../../../utils/mailer';
import { Wishlist } from '../../../model/wishlist.model';
import { ProductType } from '../../../types/ProductType';
import slugify from 'slugify';
import { Category } from '../../../model/category.model';
import { upload } from '../../../middleware/uploadImages.middleware';



const Mutation = {
    // createProduct: async (_: any,args: any) => {
    createProduct: async (_: any, { name, description, price, quantity, shipping, category, imageUrls }: any) => {
        const slug = slugify(name);
        // const imageUrl = await uploadImagesOnCloudinary(image.path);
        // console.log(args)
        // return
        try {
            const product = await Product.create({
                name,
                slug,
                description,
                price,
                quantity,
                shipping,
                images: imageUrls,
                category,
            });
            return product;
        } catch (error: any) {
            console.log(error)
            throw new ApiError(StatusCodes.FORBIDDEN, error);
        }
    },
    updateProduct: async (_: any, { id, name, description, price, quantity, shipping, category, image }: any) => {
        const product = await Product.findById(id);
        const oldQuantity = product.quantity;
        if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
        try {
            if (name) {
                product.name = name;
                product.slug = slugify(name);
            }
            if (description) product.description = description;
            if (price) product.price = price;
            if (quantity && quantity != product.quantity) product.quantity = quantity;
            if (shipping) product.shipping = shipping;
            if (category) product.category = category;
            if (image) {
                if (product.image) {
                    const publicId = product.image.split('/').pop()?.split('.')[0];
                    if (publicId) await deleteUploadedImageFromCloudinary(publicId, image.path);
                }
                const imageUrl = await uploadImagesOnCloudinary(image.path);
                if (imageUrl) product.image = imageUrl.url;
            }
            const updatedProduct = await product.save();
            // Handle stock update mail notification here


            if (oldQuantity > 0 && updatedProduct.quantity <= 0) {
                // notify out of stock
                const wishlists = await Wishlist.find({
                    products: id,
                }).populate(["user", "products"]);
                wishlists.map((w) => (
                    stockUpdatesMailer({ email: w.user.email, product: updatedProduct, avaliablity: false })
                ))


            } else if (oldQuantity <= 0 && updatedProduct.quantity > 0) {
                // notify stock is avaliable
                const wishlists = await Wishlist.find({
                    products: id,
                }).populate(["user", "products"]);

                wishlists.map((w) => (
                    stockUpdatesMailer({ email: w.user.email, product: updatedProduct, avaliablity: true })
                ))
            }
            
            return updatedProduct;
        } catch (error: any) {
            console.log(error)
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update product', error);
        }
    },
    deleteProduct: async (_: any, { id }: { id: string }) => {
        try {
            const deleteProduct = await Product.findByIdAndDelete(id);
            if (deleteProduct) return { status: StatusCodes.OK, message: 'Product deleted successfully' };
            else throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete product');
        } catch (error: any) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete product', error);
        }
    },
}

export { Mutation };