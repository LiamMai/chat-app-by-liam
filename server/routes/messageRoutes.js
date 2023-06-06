const express = require('express');
const messageRoute = express.Router();

const { isAuthenticatedUser } = require('../middlewares/auth')

const { sendMessage, getAllMessage } = require('../controllers/messageControllers');

messageRoute.post('/message/:conversationId/create', isAuthenticatedUser, sendMessage);
messageRoute.get('/messages/:conversationId', isAuthenticatedUser, getAllMessage)

module.exports = messageRoute;