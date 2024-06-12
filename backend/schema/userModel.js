const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const validator = require("validator");

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
})

const User = mongoose.model("User", userSchema);

module.exports = User;