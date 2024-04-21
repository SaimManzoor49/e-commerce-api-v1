import express from "express";

import cloudinary from "cloudinary";
import { Product } from "../model/product.model";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadAsset(url: string, folderName: string) {
  try {
    const result = await cloudinary.v2.uploader.upload(url, {
      folder: folderName,
    });
    await deleteAsset(url);
  } catch (error) {
    console.error("Error fetching asset:", error);
  }
}

// Function to delete an asset from Cloudinary
async function deleteAsset(url: string) {
  try {
    const publicId = cloudinary.v2
      .url(url, { type: "fetch" })
      ?.split("/")
      ?.pop()
      ?.split(".")[0] as string;

    await cloudinary.v2.uploader.destroy(publicId);
    console.log("Asset deleted successfully:", publicId);
  } catch (error: any) {
    console.error("Error deleting asset:", error.message);
  }
}

async function moveAsset(
  oldFolder: string,
  newFolder: string,
  assetPublicId: string
) {
  try {
    // Construct the old and new paths
    const oldPath = oldFolder ? `${oldFolder}/${assetPublicId}` : assetPublicId;
    const newPath = newFolder ? `${newFolder}/${assetPublicId}` : assetPublicId;

    // Move the asset using the rename API
    const moveResponse = await cloudinary.v2.uploader.rename(oldPath, newPath);

    // console.log("Asset move response:", moveResponse);
  } catch (error) {
    console.error("Error moving asset:", error);
  }
}

const router = express.Router();

router.post("/migration", async (req, res) => {
  try {
    // await uploadAsset(
    //   "https://res.cloudinary.com/dukjlbovc/image/upload/v1688667378/y2cwam7odpizhh9tcj5q.jpg",
    //   "dynamicFolderName"
    // );
    const url =
      "https://res.cloudinary.com/dukjlbovc/image/upload/v1686424181/samples/animals/kitten-playing.gif";

    const publicId = cloudinary.v2
      .url(url, { type: "fetch" })
      ?.split("/")
      ?.pop()
      ?.split(".")[0] as string;

    await moveAsset("samples/animals", "candidate", publicId);
    console.log("Migration completed successfully!");
  } catch (error: any) {
    console.error("Error reading file or migrating assets:", error.message);
  }



  return res.json({ success: true }).status(200);
});

export default router;
