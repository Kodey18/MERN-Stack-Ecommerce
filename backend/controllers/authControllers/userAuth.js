const async_handler = require("express-async-handler");
const User = require("../../schema/userModel");
const ErrorResponse = require("../../utils/errorResponse");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


/* 
Desc : Register a user.
method : POST
route : /api/v1/Auth/user/register.
*/
const registerUser = async_handler(async (req, res, next) => {
    const { name, email, password} = req.body;

    try{
        const userExists = await User.findOne({ email });
        if (userExists) {
            // return res.status(400).json({
            //     success: false,
            //     message: "User already exists"
            // });
            return next(new ErrorResponse("User already exists", 400));
        }
    
        const user = await User.create({
            name,
            email,
            password,
            avtar: {
                public_id: "This is sample public id.",
                url : "Sample url",
            }
        });

        if(user){
            return res.status(201).json({
                success: true,
                user
            });
        }
    }catch(err){
        next(err);
    }
});

/* 
Desc : Login a user.
method : POST
route : /api/v1/Auth/user/login
*/
const loginUser = async_handler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please enter email and password", 400));
    }

    try{
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorResponse("Invalid email or password", 401));
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return next(new ErrorResponse("Invalid email or password", 401));
        }

        generateToken(res, user._id, user.role);

        return res.status(200).json({
            success: true,
            user
        });
    }catch(err){
        next(err);
    }
});

/* 
Desc : Log-out the user.
Method : post
route : '/api/v1/Auth/user/logout'
*/
const logoutUser = async_handler( async(req, res, next) => {
    try{
        res.clearCookie("jwt");
        return res.status(200).json({
            message: "Logged out!"
        });
    } catch(err){
        next(new ErrorResponse(`error while logging out : ${err}`, 401));
    }
});

/* 
Desc : Generating a reset password link and sending it by mail
route: /api/v1/Auth/user/password/forgot
method : POST
*/
const forgetPassword = async_handler( async(req, res, next) => {
    const {email} = req.body;

    if(!email){
        return next(new ErrorResponse("Please provide an email", 401));
    }

    try{
        const user = await User.findOne({email: email});

        if(!user){
            return next(new ErrorResponse("User not found", 404));
        }

        // get resetPasswordToken
        const resetToken = user.getResetPasswordToken();

        await user.save({validateBeforeSave: false});

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/Auth/user/password/reset/${resetToken}`;

        const message = `Your password reset Token is : \n\n ${resetPasswordUrl} \n\nif you have not requested this mail for changing password then, please ignore it.`;

        try{
            await sendEmail({
                email: user.email,
                subject: `Ecommerce Password recovery`,
                message
            });

            return res.status(200).json({
                success: true.valueOf,
                message: `Email sent to ${user.email} successfully.`
            });
        }catch(err){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({validateBeforeSave: false});

            return next(err.message, 500);
        }
    }catch(error){
        next(err);
    }
});

/* 
Desc:  Reseting password
method : Put
Route : /api/v1/Auth/user/password/reset/:token
*/
const resetPassword = async_handler( async(req, res, next) => {
    const resetToken = req.params.token;
    console.log(resetToken);

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    try{
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
    
        if(!user){
            return next(new ErrorResponse("Reset password token is invalid or has been expired", 400));
        }
    
        if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorResponse("Passwords does not match", 400));
        }
    
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
    
        await user.save();
    
        return res.status(201).json({
            success: true,
            message: "Password chnged successfully"
        })
    }catch(err){
        next(err);
    }
});

module.exports = {
    registerUser,
    loginUser,
    forgetPassword,
    resetPassword,
    logoutUser,
}