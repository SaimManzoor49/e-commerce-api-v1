import jwt from "jsonwebtoken";
const generateRefreshToken = async (_id:any) => {
  return await jwt.sign({_id}, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE!,
  });
};

export default generateRefreshToken;
