import { user } from "../Schema/users.model.js"
import { ApiError } from "../Utils/apiError.js"

export const registerUser=async(req,res)=>{
  
    const {fullName,userName,email,password}=req.body
    if([fullName,userName,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError("All field are required",400)
    }
    const existingUser=await user.findOne({
        $or:[{email}, {userName}]
    })
    if(existingUser){
        throw new ApiError("Email or username already exists",409)
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    res.send("sdf")
}