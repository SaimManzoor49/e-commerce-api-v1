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
            args: {input:{ username: string; email: string; password: string }},
            context: any,
            info: any
        ): Promise<ApiResponse> => {
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
},
    async loginUser(parent: any, args: LoginUserArgs, context: any, info: any) {
        // Implementation
    },
        async logoutUser(parent: any, args: LogoutUserArgs, context: any, info: any) {
    // Implementation
},
    async refreshAccessToken(parent: any, args: RefreshAccessTokenArgs, context: any, info: any) {
    // Implementation
},
    async resetPassword(parent: any, args: ResetPasswordArgs, context: any, info: any) {
    // Implementation
},
    async resetPasswordVerify(parent: any, args: ResetPasswordVerifyArgs, context: any, info: any) {
    // Implementation
},
    async changePassword(parent: any, args: ChangePasswordArgs, context: any, info: any) {
    // Implementation
}
  };

export { Mutation };
