export class ApiResponse{
    constructor(message='success',statusCode=200,data=null){
        this.message=message
        this.statusCode=statusCode
        this.data=data
    }
}