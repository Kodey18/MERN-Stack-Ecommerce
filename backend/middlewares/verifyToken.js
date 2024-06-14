const jwt = require('jsonwebtoken');
const User = require('../schema/userModel');
const Seller = require('../schema/sellerModel');

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({
            message : "unaunthenticated",
            success : false,
        });
    }

    jwt.verify(token, process.env.JWT_SEC, async (err, user)=> {
        if(err){
            return res.status(401).json({
                message : "Forbiden",
                success : false,
                err,
            });
        }
        const Schema = user.role === "seller" ? Seller : User;

        const checkProfile = await Schema.findById(user.objId);
        if(!checkProfile){
            return res.status(401).json({
                message : "User not found",
                success : false,
            });
        }
        req.user = checkProfile;
        next();
    });
}

module.exports = verifyToken;