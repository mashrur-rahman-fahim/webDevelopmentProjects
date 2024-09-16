import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
const app=express()
app.use(cookieParser())
app.use(cors())
export default app;