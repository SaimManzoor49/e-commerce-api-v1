// import { Resolvers } from './generated/graphql';
import { User } from '../../../model/user.model';
import { ApiResponse } from '../../../utils/apiResponse';
import { ApiError } from '../../../utils/apiError';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

interface GetUserArgs {
    username?: string;
    email?: string;
    id?: string;
}

const Query = {
    async getUser(parent: any, args: GetUserArgs, context: any, info: any) {
        const { username, email, id } = args;
        if ((!email || email.length < 4) &&
            (!username || username.length < 2) &&
            (!id || id.length < 6)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Username, email or id is required");
        }

        const user = await User.findOne({
            $or: [{ email }, { username }, { _id: new mongoose.Types.ObjectId(id) }],
        }).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
        }

        return new ApiResponse(StatusCodes.OK, user, "User found");
    }
}

export { Query };
