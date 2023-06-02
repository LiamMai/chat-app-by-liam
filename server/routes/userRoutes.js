const express = require('express');
const userRoute = express();
const bodyParser = require('body-parser');

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }))

userRoute.use(express.static('public'))

const path = require('path');
const multer = require('multer');

const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})

const userControllers = require('../controllers/userControllers')

const upload = multer({ storage: storage });

 
userRoute.post('/register', userControllers.register)
userRoute.get('/user/verify/:userId/:uniqueString', userControllers.verifyMail)
userRoute.get('/verified', (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"))
})

module.exports = userRoute;