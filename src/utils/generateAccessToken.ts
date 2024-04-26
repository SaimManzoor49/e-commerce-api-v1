import jwt from "jsonwebtoken";
// const generateAccessToken = async (data: {_id:string|ObjectId,email:string,username:string}) => {
const generateAccessToken = async (data: {_id:any,email:string,username:string}) => {
  return await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE!,
  });
};

export default generateAccessToken;
