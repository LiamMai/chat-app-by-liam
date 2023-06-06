const express = require('express');
const userRoute = express.Router();
const { isAuthenticatedUser } = require('../middlewares/auth')
userRoute.use(express.static('public'))

const path = require('path');


const { register, verifyMail, login, logout, forgotPassword, resetPassword, changePassword, getCurrentUser, getUserById } = require('../controllers/userControllers')

userRoute.post('/register', register)
userRoute.get('/user/verify/:userId/:uniqueString', verifyMail)

userRoute.get('/verified', (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"))
})

userRoute.post('/login', login)
userRoute.get('/logout', logout)
userRoute.get('/user/me', isAuthenticatedUser, getCurrentUser)
userRoute.get('/user/:userId', isAuthenticatedUser, getUserById)
userRoute.post('/password/forgot', forgotPassword)
userRoute.put('/password/reset/:token', resetPassword)
userRoute.patch('/password/change', isAuthenticatedUser, changePassword)

module.exports = userRoute;