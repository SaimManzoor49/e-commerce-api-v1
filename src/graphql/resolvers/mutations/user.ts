// import { Resolvers } from './generated/graphql';
import { User } from '../../../model/user.model';
import { ApiResponse } from '../../../utils/apiResponse';
import { ApiError } from '../../../utils/apiError';
import { StatusCodes } from 'http-status-codes';
import generateRefreshToken from '../../../utils/generateRefreshToken';
import generateAccessToken from '../../../utils/generateAccessToken';
import { sendEmailForPasswordChange } from '../../../utils/mailer';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validateEmailFormate } from '../../../utils/validateEmail';
import { UserType } from '../../../types/UserType';
import cookieParser from 'cookie-parser';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
};

interface RegisterUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    input: {
        email?: string;
        username?: string;
        password: string;
    }
}

interface LogoutUserArgs {
    user: { _id: string };
}

interface RefreshAccessTokenArgs {
        refreshToken: string;
}

interface ResetPasswordArgs {
    input: {
        email?: string;
        username?: string;
    }
}

interface ResetPasswordVerifyArgs {
    token: string;
}

interface ChangePasswordArgs {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

const Mutation = {
    // Implementation
    registerUser:
        async (
            parent: any,
            args: { input: { username: string; email: string; password: string } },
            context: any,
            info: any
        ): Promise<ApiResponse> => {
            try {


                const { username, email, password } = args.input;

                if (!username || username.trim().length <= 2) {
                    throw new ApiError(
                        StatusCodes.BAD_REQUEST,
                        "Username should have at least 3 characters"
                    );
                }
                if (!email || email.trim().length <= 0) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, "Email is required");
                }
                if (!password || password.trim().length < 6) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, "Wrong Password");
                }

                const emailFormat = validateEmailFormate(email);
                if (!emailFormat) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, "Wrong email address");
                }

                const existingUser = await User.findOne({ $or: [{ email }, { username }] });

                if (existingUser?.username === username) {
                    throw new ApiError(StatusCodes.CONFLICT, "Username already taken");
                }
                if (existingUser?.email === email) {
                    throw new ApiError(StatusCodes.CONFLICT, "Email already taken");
                }

                // Create the user
                const newUser = await User.create({ username, email, password });
                newUser.password = "";
                newUser.refreshToken = "";

                return new ApiResponse(
                    StatusCodes.CREATED,
                    newUser,
                    "User registered successfully"
                );
            } catch (error: any) {
                console.log(error)
                throw new Error(error.message)
            }
        },
    async loginUser(parent: any, args: LoginUserArgs, context: any, info: any) {
        try {
            const { email, username, password } = args.input
            if ((!email || email.trim().length <= 0) && (!username || username.trim().length <= 0))
                throw new Error("Email or Username is required");

            if (!password || password.trim().length <= 0)
                throw new Error("Password is required");

            const user: UserType | null = await User.findOne({ $or: [{ email }, { username }] });

            if (!user)
                throw new Error("Wrong email or username");

            const isAuth = await user.isPasswordCorrect(password);

            if (!isAuth)
                throw new Error("Wrong password");

            const refreshToken = await generateRefreshToken(user._id);
            const accessToken = await generateAccessToken({
                _id: user._id,
                email: user.email,
                username: user.username,
            });
            
            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            // Assuming you have a method to remove sensitive fields from user
            const sanitizedUser = user.toJSON();
            delete sanitizedUser.password;
            // delete sanitizedUser.refreshToken;
            sanitizedUser.accessToken = accessToken
            // manage cookies
            // res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
            // res.cookie("accessToken", accessToken, COOKIE_OPTIONS);
            // setCookies.push({ name: "refreshToken", value: refreshToken, options: COOKIE_OPTIONS });
            // setCookies.push({ name: "accessToken", value: accessToken, options: COOKIE_OPTIONS });


            return new ApiResponse(StatusCodes.OK,sanitizedUser,"Loged in Successfully");

        } catch (error: any) {
            console.log(error)
            throw new Error(error.message)
        }
    },
    async logoutUser(parent: any, args: LogoutUserArgs, context: any, info: any) {
        // Implementation
    },
    async refreshAccessToken(parent: any, args: RefreshAccessTokenArgs, context: any, info: any) {
        const {refreshToken} = args
        if (!refreshToken)
            throw new Error("Refresh token is required");
    
          const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
    
          const currentUser = await User.findById(_id);
    
          if (!currentUser)
            throw new Error("Invalid refresh token");
    
          if (currentUser.refreshToken !== refreshToken)
            throw new Error("Invalid refresh token");
    
          const newAccessToken = await generateAccessToken({
            _id: currentUser._id,
            email: currentUser.email,
            username: currentUser.username,
          });
    
          const newRefreshToken = await generateRefreshToken(currentUser._id);
    
          currentUser.refreshToken = newRefreshToken;
    
          await currentUser.save({ validateBeforeSave: false });

        //  manage cookies
        //   res.cookie("accessToken", newAccessToken, COOKIE_OPTIONS);
        //   res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    
          return new ApiResponse(StatusCodes.CREATED,{accessToken: newAccessToken, refreshToken: newRefreshToken},"Token updated");
        },
    async resetPassword(parent: any, args: ResetPasswordArgs, context: any, info: any) {
        // Implementation
    },
    async resetPasswordVerify(parent: any, args: ResetPasswordVerifyArgs, context: any, info: any) {
        // Implementation
    },
    async changePassword(parent: any, args: ChangePasswordArgs, context: any, info: any) {
        // Implementation
    },
    async getUserData(parent: any, args: ChangePasswordArgs, context: any, info: any) {
        const token = args.token
        const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

        delete decodedData.iat
        delete decodedData.exp
        decodedData.accessToken=token
        const data = decodedData
        console.log(decodedData)
        return new ApiResponse(200,data,"Successfully");
    }
};

export { Mutation };
