const Messages = require('../models/messageModel');
const Conversations = require('../models/conversationModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const mongoose = require('mongoose')

const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { receiver, text } = req.body;
    const { conversationId } = req.params
    const userId = req.user.id;

    const checkExistConversation = await Conversations.findById(conversationId);


    if (!checkExistConversation) {
        return next(new ErrorHandler('Conversation not found', 404))
    }

    const data = await Messages.create({
        text,
        conversation: conversationId
    })

    if (data) {
        await Conversations.findByIdAndUpdate(conversationId, {
            $push: { messages: data }
        }, { new: true })

        return res.status(200).json({ success: true, message: data })
    }

    return next(new ErrorHandler("Failed to add message to the database", 400));
})

const getAllMessage = catchAsyncErrors(async (req, res, next) => {
    const { conversationId } = req.params;

    const conversation = await Conversations.findOne({
        _id: conversationId
    }).select(['messages', 'users']).populate('users').populate('messages')


    if (!conversation) {
        return next(new ErrorHandler('Conversation not found', 404));
    }

    
    return res.status(200).json({
        success: true,
        conversation
    })


})

module.exports = {
    sendMessage,
    getAllMessage
}