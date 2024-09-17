import { user } from "../Schema/users.model.js"
import { ApiError } from "../Utils/apiError.js"
import jwt from 'jsonwebtoken'
export const verifyUser=async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken||req.header('Authorization')?.replace('Bearer ',"")
        if(!token){
            throw new ApiError(401,"Unauthorized")
    
        }
        const decoded= jwt.verify(token,process.env.ACCESS_TOKEN)
        const User=await user.findById(decoded._id).select("-password -refreshToken")
        if(!User){
            throw new ApiError(404,"User not found")}
            req.user=User
            
            next()
    } catch (error) {
        throw new ApiError("invalid accessToken",401,error)
        
    }
    

}