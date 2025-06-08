class ApiResponse {
    statusCode: number;
    message: string;
    readonly success: boolean;
    data?: object;

    constructor(statusCode:number,message:string,data:object) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode >= 200 && statusCode < 300;
        data ? (this.data = data) : null;
    }
}


export {ApiResponse}