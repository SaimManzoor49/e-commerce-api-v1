import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { StatusCodes } from "http-status-codes";
import fs from "fs"
import { ApiError } from './apiError';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImagesOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    if (!localFilePath) {
        console.error("No local path provided.");
        return null;
    }
    try {
        const result: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, { resource_type: 'image' });
        fs.unlinkSync(localFilePath);
        return result;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        fs.unlinkSync(localFilePath);
        throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong while uploading the image.");
    }
}

const deleteUploadedImageFromCloudinary = async (uploadedLink: string, localFilePath: string): Promise<void> => {
    try {
        if (!uploadedLink) {
            fs.unlinkSync(localFilePath);
            throw new ApiError(StatusCodes.BAD_REQUEST, "Uploaded link not provided.");
        }

        const result = await cloudinary.uploader.destroy(uploadedLink);
        if (result.result !== 'ok') {
            fs.unlinkSync(localFilePath);
            throw new ApiError(StatusCodes.BAD_REQUEST, `Error deleting image from Cloudinary: ${result.result}`);
        }

        // console.log("Image deleted successfully from Cloudinary:", result);
    } catch (error: any) {
        fs.unlinkSync(localFilePath);
        console.error("Error deleting image from Cloudinary:", error.message);
        throw error;
    }
};

export { uploadImagesOnCloudinary, deleteUploadedImageFromCloudinary };
