import { errorCode, httpExceptions } from "./root";

export class UnprocessableEntity extends httpExceptions{
    constructor(error:any,messege:string,errorCode:errorCode){
        super(messege,errorCode,422,error)
    }
    
}
    
