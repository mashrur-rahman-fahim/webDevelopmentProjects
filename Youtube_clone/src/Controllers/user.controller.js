import {  user } from "../Schema/users.model.js"
import { ApiError } from "../Utils/apiError.js"
import { ApiResponse } from "../Utils/apiResponse.js"
import { uploadToCloudinary } from "../Utils/cloudinary.js"
import bcrypt from 'bcrypt'


const createRefreshTokenAndAccessToken=async(user_id)=>{
            try {
                const User=await user.findById(user_id)
                if(!User){
                    throw new ApiError("User not found",404)
                }
                console.log(User)
                const accessToken=await User.generateAccessToken()
                const refreshToken= User.generateRefreshToken()
                if(!accessToken)throw new ApiError("donot find access token",400)
                if(!refreshToken)throw new ApiError("donot find refresh token",400)
                User.refreshToken=refreshToken
                await User.save({
                    validateBeforeSave:false
                })
                return {accessToken,refreshToken}
            } catch (error) {
                throw new ApiError("Error while creating refresh token and access token",500)
                
            }
}




export const registerUser=async(req,res)=>{
  
    const {fulName,userName,email,password}=req.body
    // if([fullName,userName,email,password].some((field)=>field?.trim()==="")){
    //     throw new ApiError("All field are required",400)
    // }
    if(!fulName || !userName || !email || !password){
        console.log("error")
        throw new ApiError("All field are required",400)
    }
    const existingUser=await user.findOne({
        $or:[{email}, {userName}]
    })
    if(existingUser){
        console.log(existingUser)
        throw new ApiError("Email or username already exists",409)
    }
    if(!req.files?.avatar){
        throw new ApiError("Avatar is required",400)
    }
    let uploadToCloud
    if(req.files?.coverImage){
        const coverImageLocalPath = req.files?.coverImage[0]?.path;
         uploadToCloud=await uploadToCloudinary(coverImageLocalPath)
        


    }
    

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const cloudAvatar=await uploadToCloudinary(avatarLocalPath);
    const User=await user.create({
        fulName,
        userName,
        email,
        password,
        avatar:cloudAvatar.url,
        coverImage:uploadToCloud?.url || "",
        // coverImage:coverImageLocalPath,
    })
    const createdUser=await user.findById(User._id).select(
        "-password -refreshToken"
    )
    if (!createdUser){
        throw new ApiError("user not created",500)
    }
    // console.log(cloudAvatar.url)
    res.status(200).json(new ApiResponse(200,"User created successfully",createdUser))

}
export const login=async(req,res)=>{
    const {email,password}=req.body
    if (!email|| !password){
        throw new ApiError("All fields are required",400)
    }
    const User=await user.findOne({
        email

        
    })

    if(!User){
        throw new ApiError("User not found",401)
    }
    
    const decodedPassword=await bcrypt.compare(password,User.password)
    if(!decodedPassword){
        throw new ApiError("Invalid credentials",401)
    }
    const {accessToken,refreshToken}=await createRefreshTokenAndAccessToken(User._id)
    const newUser=await user.findOne({email}).select("-password -refreshToken")
    res.status(200).cookie("accessToken",accessToken,{httpOnly:true,secure:true})
    .cookie("refreshToken",refreshToken,{httpOnly:true,secure:true})
    .json(
        new ApiResponse("logged in succesfully",200,newUser)
        
    )

    

}
export const logout=async(req,res)=>{
    try {
        const User=req.user
        if(!User){
            throw new ApiError("User not found",401)
        }
        User.refreshToken=undefined
        
        const logOutUser=await User.save({
            validateBeforeSave:false
        },{new:true})
       
        res.status(200).
        clearCookie("accessToken",{httpOnly:true,secure:true})
        .clearCookie("refreshToken",{httpOnly:true,secure:true})
        .json(new ApiResponse("logged out",200,logOutUser))
    } catch (error) {
        throw new ApiError("Error while logging out",500)
        
    }

}