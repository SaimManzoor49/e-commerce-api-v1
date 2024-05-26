import { StatusCodes } from "http-status-codes";
import { Category } from "../../../model/category.model";
import { ApiError } from "../../../utils/apiError";

const Query = {
    getAllCategories: async () => {
      try {
        const allCategories = await Category.find();
        return allCategories;
      } catch (error: any) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch categories', error);
      }
    },
    getSingleCategory: async (_: any, { slug }: { slug: string }) => {
      try {
        const singleCategory = await Category.findOne({ slug });
        if (!singleCategory) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'No category found');
        }
        return singleCategory;
      } catch (error: any) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch category', error);
      }
    },
  }

  export { Query };
