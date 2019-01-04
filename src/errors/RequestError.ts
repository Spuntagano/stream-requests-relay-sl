module.exports = class ApiError {
    public e: Error;
    public message: string;
    public status: number;
    public log: boolean;

    constructor(e, message = 'Invalid request', status = 400, log = false) {
        this.e = e;
        this.message = message;
        this.status = status;
        this.log = log;
    }
};
