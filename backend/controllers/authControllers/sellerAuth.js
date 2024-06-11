const async_handler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Seller = require("../../schema/sellerModal");
const generateToken = require("../../utils/generateToken");

/* 
Desc : Register a seller.
Method : post
route : '/api/v1/seller/register'
*/
const registerSeller = async_handler( async(req, res, next) => {
    const {name, email, password, phone, address, alterante, city, state} = req.body;

    if(!name || !email || !password || !phone || !address || !city || !state){
        return res.status(301).json({
            success : false,
            message: "All credentials are required."
        });
    }

    try{
        const emailExists = await Seller.findOne({email : email});

        if(emailExists){
            return res.status(406).json({
                success : false,
                message : "Seller with this email already exist."
            });
        }

        const seller = await Seller.create(req.body);

        if(seller){
            return res.status(201).json({
                success : true,
                seller,
            });
        }
    } catch(err){
        console.log(`Error creating a seller : ${err}`);
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
        return res.status(406).json({
            success: false,
            message : "All credentials are rerquired for login.",
        });
    }

    try{
        const seller = await Seller.findOne({email}).exec();
        const authenticated = await bcrypt.compareSync(password, seller.password);

        if(!seller || !(authenticated)){
            return res.status(401).json({
                success : false,
                message : "Either email or password is incorrect."
            });
        }

        generateToken(res, seller._id);

        return res.status(201).json({
            success : true,
            seller,
        });
    }catch(err){
        console.log(`Error loging-in the seller : ${err}`);
    }
})

module.exports = {
    registerSeller,
    loginSeller,
}