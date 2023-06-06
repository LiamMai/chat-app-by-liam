//Checks if user is authenticated or not
const catchAsyncErrors = require('./catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
   
    if (!authHeader) {
        return next(new ErrorHandler('Auth Header not found.', 401))
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return next(new ErrorHandler('Login first to login this resource.', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id);
    
    if (!user) {
        return next(new ErrorHandler('Not authenticated.', 404))
    }

    req.user = user;
    next()
})

module.exports = {
    isAuthenticatedUser
}