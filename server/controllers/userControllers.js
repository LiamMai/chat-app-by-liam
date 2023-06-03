const User = require('../models/userModel')
const { sendVerificationEmail, sendEmailResetPassword } = require('../utils/functions')
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const UserVerification = require('../models/userVerification')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const path = require('path')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwtToken')

// Register User => /api/v1/register
const register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            url: 'https://res.cloudinary.com/dvkgemkdx/image/upload/v1685709809/chat-app/default_user_xwptnv.png'
        }
    })


    sendVerificationEmail({ _id: user._id, email }, res)


    sendToken(user, 200, res);

})

const verifyMail = async (req, res, next) => {
    const { userId, uniqueString } = req.params;

    UserVerification
        .find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expiresAt, uniqueString: hashedUniqueString } = result[0];
                //Checking for expired unique
                if (expiresAt < Date.now()) {
                    UserVerification
                        .deleteOne({ userId })
                        .then((result) => {
                            User
                                .deleteOne({ userId })
                                .then((result) => {
                                    const message = "Link has expired, Please sign up again.";
                                    res.redirect(`/user/verified/error=true&message=${message}`)
                                })
                                .catch((error) => {
                                    console.log('error delete user data', error)
                                    const message = "Clearing user with expired unique string failed";
                                    res.redirect(`/user/verified/error=true&message=${message}`)
                                })
                        })
                        .catch((error) => {
                            console.log('error delete user verification data', error)
                            const message = "An error occurred while clearing expired user verification record";
                            res.redirect(`/user/verified/error=true&message=${message}`)
                        })
                } else {
                    //Valid record exists validate the user string

                    //Compare the hashed unique string
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then((result) => {
                            //string matched
                            if (result) {
                                User
                                    .updateOne({ _id: userId }, { verified: true })
                                    .then(() => {
                                        UserVerification
                                            .deleteOne({ userId })
                                            .then(() => {
                                                res.sendFile(path.join(__dirname, './../views/verified.html'))
                                            })
                                            .catch((error) => {
                                                console.log('error user update verified', error)
                                                const message = "An error occurred while finalizing successful verification.";
                                                res.redirect(`/user/verified/error=true&message=${message}`)
                                            })
                                    })
                                    .catch((error) => {
                                        console.log('error user update verified', error)
                                        const message = "An error occurred while updating user record to show verified.";
                                        res.redirect(`/user/verified/error=true&message=${message}`)
                                    })

                            } else {
                                const message = "Invalid verification details passed. Check your inbox";
                                res.redirect(`/user/verified/error=true&message=${message}`)
                            }
                        })
                        .catch((error) => {
                            const message = "An error occurred while comparing unique strings";
                            res.redirect(`/user/verified/error=true&message=${message}`)
                        })
                }
            } else {
                const message = "Account record doesn't exist or has been verified already. Please sign up or log in.";
                res.redirect(`/user/verified/error=true&message=${message}`)
            }
        })
        .catch((error) => {
            console.log('error user verification', error)
            const message = "An error occurred while checking for existing user verification record";
            res.redirect(`/user/verified/error=true&message=${message}`)
        })
}

const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        next(new ErrorHandler('Please enter email & password', 400))
    }

    //Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email Or Password', 401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email Or Password', 401))
    }

    const isVerified = await user.verified;

    if (!isVerified) {
        return next(new ErrorHandler('Email hasn\'t been verified yet. Check your mail!', 401))
    }

    sendToken(user, 200, res);
})

const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({ success: true, message: 'Logged out' })
})

const test = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ success: true, data: 'TEST' })
})

const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    //Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {
        
        await sendEmailResetPassword({
            email: user.email,
            subject: 'Chat App By Liam Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpired = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }
})

const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params
    const { password, confirmPassword } = req.body
    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpired: {$gt: Date.now()}
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    //Setup new password
    user.password = password;

    user.resetPasswordToken = undefined
    user.resetPasswordExpired = undefined;

    await user.save();

    sendToken(user, 200, res);
}) 

module.exports = {
    register,
    verifyMail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    test
}