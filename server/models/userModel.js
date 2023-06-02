const mongoose = require('mongoose');
const { ROLES } = require('../constants')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
        minLength: [6, 'password cannot be less than 6 characters']
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
userSchema.pre('save', async function(next)  {
    if(!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

//Return JWT Token
userSchema.methods.getJwtToken = () => {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

module.exports = mongoose.model('User', userSchema);
