import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../model/user.model";
import { Request } from "express";


export const verifyJWT = asyncHandler(async (req: Request, res, next) => {
  // const token = req.cookies?.accessToken || req.header("Authorization")?.split("Bearer")[1];
  const token = req.cookies?.accessToken || req.header("Authorization")?.split("Bearer ")[1];
  if (!token)
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized request");

  const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

  if (!decodedData || !decodedData._id)
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");

  const user = await User.findById(decodedData._id).select("-password -refreshToken");

  if (!user)
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token");

  req.body.user = user;
  next();
});
export const verifyAdminRole = asyncHandler(async (req: Request, res, next) => {
  const user = req.body.user;

  try {
    // if (!user || user.role[0] !== 'admin') {
      const isAdmin = !!user.role.find((r:string)=>(r==='admin'))
      if(!isAdmin) throw new ApiError(StatusCodes.FORBIDDEN, "Insufficient permissions");
    // }
    next();
  } catch (error) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Insufficient permissions");
  }
});