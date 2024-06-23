const async_handler = require("express-async-handler");
const ErrorResponse = require("../../utils/errorResponse");
const Seller = require("../../schema/sellerModel");

/**
 * Desc : delete seller account
 * route : /api/v1/seller/
 * Method : DELETE
*/
const deleteSeller = async_handler( async(req, res, next) => {
    const sellerId = req.body.sellerId;

    try{
        if(sellerId !== req.user._id){
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

module.exports = {
    deleteSeller,
};