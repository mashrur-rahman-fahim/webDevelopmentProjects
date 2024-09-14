import { errorCode, httpExceptions } from "./root";

export class Unauthorization extends httpExceptions{
    constructor(messege:string,errorCode:errorCode){
        super(messege,errorCode,401,null)
    }
}