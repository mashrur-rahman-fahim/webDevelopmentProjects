export class ApiError extends Error{
    constructor(message,statusCode,errors){
        super(message)
        this.message=message
        this.statusCode=statusCode
        this.errors=errors

    }
}