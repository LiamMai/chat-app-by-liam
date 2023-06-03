const express = require('express');
const friendRoute = express();
const bodyParser = require('body-parser');
const { isAuthenticatedUser } = require('../middlewares/auth')

friendRoute.use(bodyParser.json());
friendRoute.use(bodyParser.urlencoded({ extended: true }))

const { sendFriendRequest, acceptFriendRequest, getFriends } = require('../controllers/friendControllers')

friendRoute.post('/friends/:friendId', isAuthenticatedUser, sendFriendRequest);
friendRoute.patch('/friends/:friendRequestId', isAuthenticatedUser, acceptFriendRequest);
friendRoute.get('/friends', isAuthenticatedUser, getFriends);

module.exports = friendRoute