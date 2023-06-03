const mongoose = require('mongoose');
const { ROLES } = require('../constants')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        minLength: [3, 'name cannot be less than 3 characters']

    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address']
    },
    avatar: {
        url: {
            type: String,
            required: true
        }
    },
    password: {
        type: String,
        required: [true, ''],
        minLength: [6, 'password cannot be less than 6 characters'],
        select: false
    },
    is_online: {
        type: String,
        default: '0'
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: ROLES.USER
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,

}, { timestamps: true });


//Encrypting password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

//Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//Return JWT Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

//Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Has and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    //Set token expire time
    this.resetPasswordExpired = Date.now() + 30 * 60 * 1000

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);
