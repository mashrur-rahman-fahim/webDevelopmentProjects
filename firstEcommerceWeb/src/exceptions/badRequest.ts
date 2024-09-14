import { errorCode, httpExceptions } from "./root";

export class BadRequestException extends httpExceptions{
    constructor(message:string,errorCode:errorCode,){
        super(message,errorCode,400,null);

    }
}