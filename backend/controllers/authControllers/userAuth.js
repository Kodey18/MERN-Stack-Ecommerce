const async_handler = require("express-async-handler");
const User = require("../../schema/userModel");
const ErrorResponse = require("../../utils/errorResponse");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

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

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
}