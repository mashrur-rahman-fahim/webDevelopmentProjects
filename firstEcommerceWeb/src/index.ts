import express,{Express} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middleware/errors'
const app:Express=express()
app.use(express.json())
app.use('/',rootRouter)
import { User } from "@prisma/client";

declare global{
    namespace Express{
        interface Request{
            user?:User;
        }
    }
}


export const prismaClinet= new PrismaClient({log:['query']})
app.use(errorMiddleware)
app.listen(PORT,()=>{
    console.log("Server is running on port PORT")
 
})
