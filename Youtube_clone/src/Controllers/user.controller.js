import mongoose from "mongoose"
import { user } from "../Schema/users.model.js"
import { ApiError } from "../Utils/apiError.js"
import { ApiResponse } from "../Utils/apiResponse.js"
import { uploadToCloudinary } from "../Utils/cloudinary.js"
import bcrypt, { compare } from 'bcrypt'


const createRefreshTokenAndAccessToken = async (user_id) => {
    try {
        const User = await user.findById(user_id)
        if (!User) {
            throw new ApiError("User not found", 404)
        }

        const accessToken = await User.generateAccessToken()
        const refreshToken = User.generateRefreshToken()
        if (!accessToken) throw new ApiError("donot find access token", 400)
        if (!refreshToken) throw new ApiError("donot find refresh token", 400)
        User.refreshToken = refreshToken
        await User.save({
            validateBeforeSave: false
        })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError("Error while creating refresh token and access token", 500)

    }
}




export const registerUser = async (req, res) => {

    const { fulName, userName, email, password } = req.body

    if (!fulName || !userName || !email || !password) {

        throw new ApiError("All field are required", 400)
    }
    const existingUser = await user.findOne({
        $or: [{ email }, { userName }]
    })
    if (existingUser) {

        throw new ApiError("Email or username already exists", 409)
    }
    if (!req.files?.avatar) {
        throw new ApiError("Avatar is required", 400)
    }
    let uploadToCloud
    if (req.files?.coverImage) {
        const coverImageLocalPath = req.files?.coverImage[0]?.path;
        uploadToCloud = await uploadToCloudinary(coverImageLocalPath)



    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const cloudAvatar = await uploadToCloudinary(avatarLocalPath);
    const User = await user.create({
        fulName,
        userName,
        email,
        password,
        avatar: cloudAvatar.url,
        coverImage: uploadToCloud?.url || "",

    })
    const createdUser = await user.findById(User._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError("user not created", 500)
    }

    res.status(200).json(new ApiResponse(200, "User created successfully", createdUser))

}
export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new ApiError("All fields are required", 400)
    }
    const User = await user.findOne({
        email


    })

    if (!User) {
        throw new ApiError("User not found", 401)
    }

    const decodedPassword = await bcrypt.compare(password, User.password)
    if (!decodedPassword) {
        throw new ApiError("Invalid credentials", 401)
    }
    const { accessToken, refreshToken } = await createRefreshTokenAndAccessToken(User._id)
    const newUser = await user.findOne({ email }).select("-password -refreshToken")
    res.status(200).cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
        .json(
            new ApiResponse("logged in succesfully", 200, newUser)

        )



}
export const logout = async (req, res) => {
    try {
        const User = req.user
        if (!User) {
            throw new ApiError("User not found", 401)
        }
        User.refreshToken = undefined

        const logOutUser = await User.save({
            validateBeforeSave: false
        }, { new: true })

        res.status(200).
            clearCookie("accessToken", { httpOnly: true, secure: true })
            .clearCookie("refreshToken", { httpOnly: true, secure: true })
            .json(new ApiResponse("logged out", 200, logOutUser))
    } catch (error) {
        throw new ApiError("Error while logging out", 500)

    }

}
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!req.user) {
        throw new ApiError("User not found", 401)
    }
    const user = req.user
    if (!bcrypt.compare(oldPassword, user.password)) {
        throw new ApiError("Invalid old password", 401)
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    user.password = hashedPassword
    await user.save({
        validateBeforeSave: false
    })
    res.status(200).json(new ApiResponse("Password changed successfully", 200))

}
export const updateUser = async (req, res) => {
    try {
        const { fulName, email } = req.body
        if (!fulName && !email) {
            throw new ApiError("At least one field must be updated", 400)
        }
        if (!req.user) {
            throw new ApiError("User not found", 401)
        }
        const user = req.user
        if (fulName) {
            user.fulName = fulName

        }
        if (email) {
            user.email = email
        }
        const newUser = await user.save({
            validateBeforeSave: false
        }, { new: true })
        res.status(200).json(new ApiResponse("User updated successfully", 200, newUser))
    } catch (error) {
        res.send(error)

    }



}
export const getAllUser = async (req, res) => {
    const users = await user.find({})
    res.status(200).json(users)
}
export const currentUser = async (req, res) => {
    if (!req.user) {
        throw new ApiError("user not Found", 404)
    }
    res.status(200).json(
        new ApiResponse("User found", 200, req.user)
    )

}

export const getChannel = async (req, res) => {
    const { userName } = req.params

    if (!userName) {
        throw new ApiError("Username missing", 200)
    }
    const channel = await user.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"

            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                    then: true,
                    else: false

                }
            }
        },
        {
            $project: {
                fulName: 1,
                userName: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])
    res.send(channel[0])


}
export const getWatchHistory = async (req, res, next) => {
    const User =await  user.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fulName: 1,
                                        userName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }

                        }
                    }
                ]
            }
        }
    ])
    res.json(User[0].watchHistory)
}
