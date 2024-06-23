const async_handler = require("express-async-handler");
const ErrorResponse = require("../../utils/errorResponse");
const Seller = require("../../schema/sellerModel");
const bcrypt = require('bcryptjs');

/**
 * Desc : delete seller account
 * route : /api/v1/seller/
 * Method : DELETE
*/
const deleteSeller = async_handler( async(req, res, next) => {
    const { sellerId } = req.body;
    try{
        if(sellerId !== req.user._id.toString()){
            return next(new ErrorResponse('Unauthorised Seller', 401));
        }

        await Seller.findByIdAndDelete(sellerId);

        res.clearCookie('jwt');

        return res.status(201).json({
            success: true,
            message: 'Seller account deleted successfully',
        });
    }catch(err){
        next(err);
    }
});

/**
 * Desc : Update seller profile
 * route : /api/v1/seller/
 * method : put
 */
const updaetSeller = async_handler( async(req, res, next) => {
    const {sellerId, ...updateDetails} = req.body;

    try{
        if(sellerId !== req.user._id.toString()){
            return next(new ErrorResponse('Unauthorised Seller', 401));
        }

        const updatedSeller = await Seller.findOneAndUpdate(sellerId, updateDetails, {
            new: true,
            runValidators: true,
        });

        if(updatedSeller){
            return res.status(201).json({
                success: true,
                message: 'Seller profile updated successfully',
            });
        }
    }catch(err){
        next(err);
    }
});

/**
 * Desc : Update Seller Password.
 * router : /api/v1/seller/password
 * method : put
 */

const updatePassword = async_handler( async(req, res, next) => {
    const {sellerId, oldPassword, newPassword } = req.password;

    try{
        if(sellerId !== req.user._id.toString()){
            return next(new ErrorResponse('Unauthorised Seller', 401));
        }

        const seller = await Seller.findById(sellerId).select("+password");

        const isPasswordMatched = await bcrypt.compare(oldPassword, seller.password);

        if(!isPasswordMatched){
            return next(new ErrorResponse('Old password is incorrect', 401));
        }

        seller.password = newPassword;

        await seller.save();

        return res.status(201).json({
            success: true,
            message: 'Password updated successfully',
        });
    }catch(err){
        next(err);
    }
});

module.exports = {
    updaetSeller,
    updatePassword,
    deleteSeller,
};