const express = require('express');
const userRoute = express();
const bodyParser = require('body-parser');
const { isAuthenticatedUser } = require('../middlewares/auth')

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }))

userRoute.use(express.static('public'))

const path = require('path');


const { register, verifyMail, login, logout, forgotPassword, resetPassword, changePassword, test } = require('../controllers/userControllers')

userRoute.post('/register', register)
userRoute.get('/user/verify/:userId/:uniqueString', verifyMail)

userRoute.get('/verified', (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"))
})

userRoute.post('/login', login)
userRoute.get('/logout', logout)
userRoute.post('/password/forgot', forgotPassword)
userRoute.put('/password/reset/:token', resetPassword)
userRoute.patch('/password/change', isAuthenticatedUser, changePassword)

module.exports = userRoute;