const async_handler = require("express-async-handler");
const User = require("../../schema/userModel");
const errorResponse = require("../../utils/errorResponse");

/* 
Desc:  get user information
route: /api/v1/user/:userID
method: GET
*/
const getUserInformation = async_handler( async(req, res, next) => {
    const userID = req.params.userID;
    console.log({
        userID : req.params.userID,
        reqUser : req.user._id,
    });
    if(req.user._id.toString() !== userID){
        return next(new errorResponse("Unauthorized access", 401));
    } else {
        console.log("Authorized access.");
    }

    try{
        const user = await User.findById(userID);

        if(!user){
            return next(new errorResponse("User not found", 401));
        }

        return res.status(201).json({
            success: true,
            user,
        });
    }catch(err){
        next(err)
    }
});

module.exports = {
    getUserInformation,
};