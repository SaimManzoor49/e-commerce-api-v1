import jwt from "jsonwebtoken";
const generateToken = async (data: {email:string}) => {
  return await jwt.sign(data, process.env.TOKEN_SECRET!, {
    expiresIn: process.env.TOKEN_LIFE!,
  });
};

export default generateToken;
