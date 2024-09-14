export class httpExceptions extends Error{
    message: string;
    errorCode:errorCode;
    statusCode: number;
    errors:any;
    constructor(message:string,errorCode:errorCode,statusCode:number,errors:any){
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
        
    }

}
export enum errorCode{
    USER_NOT_FOUND=1001,
    USER_ALREADY_EXISTS=1002,
    INCORRECT_PASSSWORD=1003,
    UNPROCESSABLE_ENTITY=2001,
    INTERNAL_EXCEPTION=3001,
    UNAUTHORIZED=4001,
    PRODUCT_NOT_FOUND=5001,
     
}