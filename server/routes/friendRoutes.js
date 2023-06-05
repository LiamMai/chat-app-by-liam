const express = require('express');
const friendRoute = express();
const { isAuthenticatedUser } = require('../middlewares/auth')

const { sendFriendRequest, acceptFriendRequest, getFriends, searchFriends, rejectFriendRequest } = require('../controllers/friendControllers')

friendRoute.post('/friends/:friendId/send', isAuthenticatedUser, sendFriendRequest);
friendRoute.patch('/friends/:friendRequestId/accept', isAuthenticatedUser, acceptFriendRequest);
friendRoute.patch('/friends/:friendRequestId/reject', isAuthenticatedUser, rejectFriendRequest);
friendRoute.get('/friends', isAuthenticatedUser, getFriends);
friendRoute.get('/friends/search', isAuthenticatedUser, searchFriends);

module.exports = friendRoute