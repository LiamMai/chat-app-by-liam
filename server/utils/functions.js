const { v4: uuid4 } = require('uuid')
const bcrypt = require('bcrypt')
const UserVerification = require('../models/userVerification')

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log('error', error)
    } else {
        console.log("Mail ready for messages")
        console.log('success', success)
    }
})

const sendVerificationEmail = ({ _id, email }, res) => {
    const uniqueString = uuid4() + _id;

    const mailOptions = {
        from: process.env.NODEMAILER_USERNAME,
        to: email,
        subject: 'Verify Your Email To Login Chat App By Liam',
        html: `
        <p>Verify your email address to complete the signup and login into your account</p>
        <p>This link <b>Expires in 6 hours.</b></p>
        <p>Press <a href=${process.env.BASE_URL}/user/verify/${_id}/${uniqueString}>Here</a> to process</p>
        `
    }

    const saltRounds = 10;
    bcrypt
        .hash(uniqueString, saltRounds)
        .then((hashedUniqueString) => {
            const userVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000,
            })

            userVerification
                .save()
                .then(() => {
                    transporter
                        .sendMail(mailOptions)
                        .then()
                        .catch((error) => {
                            console.log('error send email', error)
                            res.json({
                                status: "FAILED",
                                message: "Verification email failed"
                            })
                        })
                })
                .catch((error) => {
                    console.log('error verification data', error)
                    res.json({
                        status: "FAILED",
                        message: "Couldn't save verification email data!"
                    })
                })
        })
        .catch(() => {
            res.json({
                status: "FAILED",
                message: "An error occurred while hashing email data!"
            })
        })
}

const sendEmailResetPassword = async ({ email, subject, message }) => {
    const options = {
        from: `${process.env.NODEMAILER_USERNAME} <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject,
        text: message
    }

    await transporter.sendMail(options)
}

module.exports = {
    sendVerificationEmail,
    sendEmailResetPassword
}