import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import  jwt from "jsonwebtoken"
const userSchema=new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
      

    },
    fullName:{
        type:String,
        required:true,
        trim:true,

    },
    avatar:{
        type:String,
        required:true,
        

    },
    coverImage:{
        type:String,
        

    },
    refreshToken:{
        type:String,
        
        

    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:true,
        

    }



},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10)
    next()


})



userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        fullName:this.fullName,
        avatar:this.avatar,
        coverImage:this.coverImage,
        watchHistory:this.watchHistory
    },process.env.ACCESS_TOKEN,{expiresIn:ACCESS_TOKEN_EXP})
}
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
       
    },process.env.REFRESH_TOKEN,{expiresIn:REFRESH_TOKEN_EXP})
}

export const user=mongoose.model("user",userSchema)