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
const express_1 = __importDefault(require("express"));
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
function uploadAsset(url, folderName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield cloudinary_1.default.v2.uploader.upload(url, {
                folder: folderName,
            });
            yield deleteAsset(url);
        }
        catch (error) {
            console.error("Error fetching asset:", error);
        }
    });
}
// Function to delete an asset from Cloudinary
function deleteAsset(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const publicId = (_c = (_b = (_a = cloudinary_1.default.v2
                .url(url, { type: "fetch" })) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b.pop()) === null || _c === void 0 ? void 0 : _c.split(".")[0];
            yield cloudinary_1.default.v2.uploader.destroy(publicId);
            console.log("Asset deleted successfully:", publicId);
        }
        catch (error) {
            console.error("Error deleting asset:", error.message);
        }
    });
}
function moveAsset(oldFolder, newFolder, assetPublicId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Construct the old and new paths
            const oldPath = oldFolder ? `${oldFolder}/${assetPublicId}` : assetPublicId;
            const newPath = newFolder ? `${newFolder}/${assetPublicId}` : assetPublicId;
            // Move the asset using the rename API
            const moveResponse = yield cloudinary_1.default.v2.uploader.rename(oldPath, newPath);
            // console.log("Asset move response:", moveResponse);
        }
        catch (error) {
            console.error("Error moving asset:", error);
        }
    });
}
const router = express_1.default.Router();
router.post("/migration", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // await uploadAsset(
        //   "https://res.cloudinary.com/dukjlbovc/image/upload/v1688667378/y2cwam7odpizhh9tcj5q.jpg",
        //   "dynamicFolderName"
        // );
        const url = "https://res.cloudinary.com/dukjlbovc/image/upload/v1686424181/samples/animals/kitten-playing.gif";
        const publicId = (_c = (_b = (_a = cloudinary_1.default.v2
            .url(url, { type: "fetch" })) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b.pop()) === null || _c === void 0 ? void 0 : _c.split(".")[0];
        yield moveAsset("samples/animals", "candidate", publicId);
        console.log("Migration completed successfully!");
    }
    catch (error) {
        console.error("Error reading file or migrating assets:", error.message);
    }
    return res.json({ success: true }).status(200);
}));
exports.default = router;
