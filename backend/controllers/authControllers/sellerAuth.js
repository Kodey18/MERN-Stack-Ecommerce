const async_handler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Seller = require("../../schema/sellerModel");
const generateToken = require("../../utils/generateToken");
const ErrorResponse = require("../../utils/errorResponse");

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
        const seller = await Seller.findOne({email}).exec();
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

module.exports = {
    registerSeller,
    loginSeller,
    logoutSeller
}