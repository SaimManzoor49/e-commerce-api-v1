import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../../utils/apiError";
import { Category } from "../../../model/category.model";
import slugify from "slugify";

const Mutation = {
    addCategory: async (_: any, { name }: { name: string }) => {
        if (!name || name.trim().length < 3) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Name should have at least 3 characters');
        }
        const findExistingCategory = await Category.findOne({ name });
        if (findExistingCategory) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Category already exists');
        }
        try {
            const category = await Category.create({ name, slug: slugify(name) });
            return category;
        } catch (error: any) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create category', error);
        }
    },
    updateCategory: async (_: any, { id, name }: { id: string, name: string }) => {
        if (!name || name.trim().length < 3) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Enter the new name of category');
        }
        try {
            const updateCategory = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
            if (!updateCategory) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update category');
            }
            return updateCategory;
        } catch (error: any) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update category', error);
        }
    },
    deleteCategory: async (_: any, { id }: { id: string }) => {
        if (!id) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Please select the category you want to delete');
        }
        try {
            const deleteCategory = await Category.findByIdAndDelete(id);
            if (!deleteCategory) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete category');
            }
            return { status: StatusCodes.OK, message: 'Category deleted successfully' };
        } catch (error: any) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete category', error);
        }
    },
}

export { Mutation }