const async_handler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Seller = require("../../schema/sellerModel");
const generateToken = require("../../utils/generateToken");
const ErrorResponse = require("../../utils/errorResponse");
const { forgetPassword } = require("./userAuth");
const sendEmail = require("../../utils/sendEmail");

/* 
Desc : Register a seller.
Method : post
route : '/api/v1/seller/register'
*/
const registerSeller = async_handler( async(req, res, next) => {
    const {name, email, password, phone, address, alterante, city, state} = req.body;

    if(!name || !email || !password || !phone || !address || !city || !state){
        return next(new ErrorResponse("All credentials are required.", 301));
    }

    try{
        const emailExists = await Seller.findOne({email : email});

        if(emailExists){
            return next(new ErrorResponse("Seller with this email already exist.", 301));
        }

        const seller = await Seller.create(req.body);

        if(seller){
            return res.status(201).json({
                success : true,
                seller,
            });
        }
    } catch(err){
        next(err);
    }
});

/* 
Desc : Log-in the seler.
Method : post
route : '/api/v1/seller/login'
*/
const loginSeller = async_handler( async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse("All credentials are rerquired for login.", 406));
    }

    try{
        const seller = await Seller.findOne({email}).select("+password").exec();
        const authenticated = await bcrypt.compareSync(password, seller.password);

        if(!seller || !(authenticated)){
            return next(new ErrorResponse("Either email or password is incorrect.", 403));
        }

        generateToken(res, seller._id, seller.role);

        return res.status(201).json({
            success : true,
            seller,
        });

    }catch(err){
        next(err);
    }
});

/* 
Desc : Log-out the seler.
Method : post
route : '/api/v1/seller/logout'
*/
const logoutSeller = async_handler( async(req, res, next) => {
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
Desc: generate Forget password link and token
route : /api/v1/auth/seller/password/forgot
method : post
*/
const forgotPassword = async_handler( async(req, res, next) => {
    const {email} = req.body;

    if(!email){
        return next(new ErrorResponse("Please provide an email", 401));
    }

    try{
        const seller = await Seller.findOne({email: email});

        if(!seller){
            return next(new ErrorResponse("seller not found", 404));
        }

        // get resetPasswordToken
        const resetToken = user.getResetPasswordToken();

        await seller.save({validateBeforeSave: false});

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/Auth/seller/password/reset/${resetToken}`;

        const message = `Your password reset Token is : \n\n ${resetPasswordUrl} \n\nif you have not requested this mail for changing password then, please ignore it.`;

        try{
            await sendEmail({
                email: seller.email,
                subject: `Ecommerce Password recovery`,
                message
            });

            return res.status(200).json({
                success: true.valueOf,
                message: `Email sent to ${seller.email} successfully.`
            });
        }catch(err){
            seller.resetPasswordToken = undefined;
            seller.resetPasswordExpire = undefined;

            await seller.save({validateBeforeSave: false});

            return next(err.message, 500);
        }
    }catch(error){
        next(err);
    }
});


const resetPassword = async_handler( async(req, res, next) => {
    const resetToken = req.params.token;
    console.log(resetToken);

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    try{
        const seller = await Seller.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
    
        if(!seller){
            return next(new ErrorResponse("Reset password token is invalid or has been expired", 400));
        }
    
        if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorResponse("Passwords does not match", 400));
        }
    
        seller.password = req.body.password;
        seller.resetPasswordToken = undefined;
        seller.resetPasswordExpire = undefined;
    
        await seller.save();
    
        return res.status(201).json({
            success: true,
            message: "Password chnged successfully"
        })
    }catch(err){
        next(err);
    }
});

module.exports = {
    registerSeller,
    loginSeller,
    logoutSeller,
    forgetPassword,
    resetPassword,
}