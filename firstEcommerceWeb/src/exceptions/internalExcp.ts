import { errorCode, httpExceptions } from "./root";

export class internalException extends httpExceptions{
    constructor(messege:string,error:any,errorCode:errorCode){
        super(messege,errorCode,500,error);
    }
    
}