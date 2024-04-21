import jwt from "jsonwebtoken";
import { ObjectId, Schema } from "mongoose";
// const generateAccessToken = async (data: {_id:string|ObjectId,email:string,username:string}) => {
const generateAccessToken = async (data: {_id:string,email:string,username:string}) => {
  return await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE!,
  });
};

export default generateAccessToken;
