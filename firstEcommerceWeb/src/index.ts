import express,{Express} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middleware/errors'
const app:Express=express()
app.use(express.json())
app.use('/',rootRouter)



export const prismaClinet= new PrismaClient({log:['query']})
app.use(errorMiddleware)
app.listen(PORT,()=>{
    console.log("Server is running on port PORT")
 
})
