export const asyncHandler=(fn)=>{
    return async (req,res,next)=>{
        try{
            await fn(req,res,next)
        }
        catch(err){
                console.log(`error:${err}`)
            res.status(500).json({success:false,message:"Something went wrong"})
        }
    }
}