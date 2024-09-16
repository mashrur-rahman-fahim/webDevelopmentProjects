import mongoose from "mongoose";
import { DB_NAME } from "../constrants.js";

export const mongodbConnect=async(req,res)=>{
    try{
       const connectionInstant= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`connected to mongodb!! host${connectionInstant.connection.host}`)
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }

}