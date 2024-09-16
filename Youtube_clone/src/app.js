import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import { userRoute } from './Routes/user.route.js';
const app=express()
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use('/users',userRoute)
export default app;