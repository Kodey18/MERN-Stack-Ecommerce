const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the seller name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter the seller email.'],
        unique: true,
        validate: [validator.isEmail, "PLease enter a proper email"],
    },
    password: {
        type: String,
        required: [true, 'Please enter the seller password.'],
        select: false,
    },
    phone : {
        type: String,
        required: [true, "Please enter the phone number."]
    },
    address: {
        type: String,
        required: [true, "Please enter the address,"]
    },
    alternateAddress: {
        type: String,
        required: false,
    },
    city : {
        type : String,
        required: true,
    },
    state : {
        type : String,
        required : true,
    },
    role : {
        type: String,
        default: "seller",
        required: false,
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
}, {
    timestamps: true
});

sellerSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next;
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

sellerSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;