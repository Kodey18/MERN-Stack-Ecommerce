const async_handler = require("express-async-handler");
const User = require("../../schema/userModel");
const errorResponse = require("../../utils/errorResponse");
// const bcrypt = require("bcryptjs");
const bcryptjs = require("bcryptjs");

/*
Desc: get user information
route: /api/v1/user/profile
method: GET
*/
const getUserInformation = async_handler( async(req, res, next) => {

    try{
        const user = req.user;

        return res.status(201).json({
            success: true,
            user
        });
    }catch(err){
        next(err)
    }
});

/*
Desc: update User Password
route: /api/v1/user/
method: GET
*/
const updatePassword = async_handler( async(req, res, next) => {
    const {oldPassword, newPassword} = req.body;

    try{
        const user = await User.findById(req.user._id).select("+password");

        const isPasswordMatched = await bcryptjs.compare(oldPassword, user.password);

        if(!isPasswordMatched){
            return next(new errorResponse("Old password is incorrect", 400));
        }

        user.password = newPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }catch(err){
        next(err);
    }
});

/*
Desc: update User Profile
route: /api/v1/user/profile
method: PUT
*/
const updateUser = async_handler( async(req, res, next) => {
    try{
        const newUserData = {
            name: req.body.name,
            email: req.body.email
        }
    
        const user = await User.findOneAndUpdate(req.user._id, newUserData, {
            new: true,
            runValidators: true,
        });
    
        return res.status(201).json({
            success: true,
            user,
        });
    }catch(err){
        next(err);
    }
});

/*
Desc: Delete User Account
route: /api/v1/user/delete
method: DELETE
*/
const deleteUserAccount = async_handler(async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);

        if (!user) {
            return next(new errorResponse("User not found", 404));
        }

        res.clearCookie("jwt");

        return res.status(200).json({
            success: true,
            message: "User account deleted successfully",
        });
    } catch (err) {
        next(err);
    }
});

module.exports = {
    getUserInformation,
    updatePassword,
    updateUser,
    deleteUserAccount,
};