import { StatusCodes } from "http-status-codes";
import { Product } from "../../../model/product.model";
import { ApiError } from "../../../utils/apiError";



const Query = {
    getAllProducts: async (_: any, { page = 1, limit = 10 }: { page: number, limit: number }) => {
      try {
        const query: any = {};
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
        const result = await Product.aggregatePaginate(query, options);
        return result;
      } catch (error: any) {
        throw new ApiError(StatusCodes.FORBIDDEN, error);
      }
    },
    getSingleProduct: async (_: any, { slug }: { slug: string }) => {
      try {
        const singleProduct = await Product.findOne({ slug });
        if (!singleProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'No product found');
        return singleProduct;
      } catch (error: any) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch product', error);
      }
    },
    filterProduct: async (_: any, { category, minPrice, maxPrice }: { category?: string, minPrice?: number, maxPrice?: number }) => {
      try {
        const query: any = {};
        if (category) query.category = category;
        if (minPrice !== undefined && !isNaN(minPrice)) query.price = { $gte: minPrice };
        if (maxPrice !== undefined && !isNaN(maxPrice)) {
          if (query.price) query.price.$lte = maxPrice;
          else query.price = { $lte: maxPrice };
        }
        const products = await Product.find(query);
        return products;
      } catch (error: any) {
        console.log(error)
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve products', error);
      }
    },
    searchProducts: async (_: any, { keyword }: { keyword: string }) => {
      try {
        if (!keyword || !keyword.trim()) throw new Error('Please enter a valid keyword.');
        const results = await Product.find({
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        });
        return results;
      } catch (error: any) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve products', error);
      }
    }
}
export { Query };
