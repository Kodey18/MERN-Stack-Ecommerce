const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Your name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email."],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Your password must be longer than 8 characters"],
        select: false
    },
    avtar:{
        public_id: {
            type: String,
            required: true,
        },
        url : {
            type: String,
            required :  true,
        }
    },
    role: {
        type: String,
        default: "user"
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    resetPasswordToken : String,
    resetPasswordExpire : Date,
},{
    timestamps: true
});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        return next;
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.getResetPasswordToken = () => {
    // here randomBytes will generate a buffer value with 20 bytes, then using the toString("hex") that buffer value will be convverted to hex value.
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Here by using this.resetPasswordToken the schema is directly updated by its value.
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

        this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        return resetToken;
}

const User = mongoose.model("User", userSchema);

module.exports = User;