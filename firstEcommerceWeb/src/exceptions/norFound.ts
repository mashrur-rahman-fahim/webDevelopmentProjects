import { errorCode, httpExceptions } from "./root";

export class NotFoundException extends httpExceptions{
    constructor(messege:string,errorCode:errorCode){
        super(messege,errorCode,404,null)
    }
}