const express = require('express');
const userRoute = express();
const bodyParser = require('body-parser');
const { isAuthenticatedUser } = require('../middlewares/auth')

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }))

userRoute.use(express.static('public'))

const path = require('path');


const { register, verifyMail, login, logout, test } = require('../controllers/userControllers')



userRoute.post('/register', register)
userRoute.get('/user/verify/:userId/:uniqueString', verifyMail)

userRoute.get('/verified', (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"))
})

userRoute.post('/login', login)
userRoute.get('/logout', logout)
userRoute.get('/test', isAuthenticatedUser, test)

module.exports = userRoute;