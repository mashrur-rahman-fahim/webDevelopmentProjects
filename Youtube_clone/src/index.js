import express from "express"
import app from "./app.js"
import dotenv from 'dotenv'
import { mongodbConnect } from "./DB/index.js"

dotenv.config({
    path: './.env'
})
const PORT=process.env.PORT

mongodbConnect().then(()=>{
    app.listen(PORT,()=>{console.log("Connected to port")})
}).catch((err)=>{console.log(`connection failed! error:${err}`)})