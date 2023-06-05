const express = require('express');
const conversationRoute = express();
const { isAuthenticatedUser } = require('../middlewares/auth')

const { createConversation } = require('../controllers/conversationControllers')

conversationRoute.post('/conversation/create', isAuthenticatedUser, createConversation)

module.exports = conversationRoute