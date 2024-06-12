const ErrorResponse = require("../utils/errorResponse");

const role = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role){
            return next(new ErrorResponse("Access denied", 400));
        }
        next();
    }
}

module.exports = role;