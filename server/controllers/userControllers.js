const User = require('../models/userModel')
const { sendVerificationEmail } = require('../utils/functions')
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const UserVerification = require('../models/userVerification')
const bcrypt = require('bcrypt')
const path = require('path')

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

    const token = user.getJwtToken();

    sendVerificationEmail({ _id: user._id, email }, res)

    res.status(201).json({ success: true, user, token })

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
})

module.exports = {
    register,
    verifyMail
}