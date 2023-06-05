const Messages = require('../models/messageModel');
const Conversations = require('../models/conversationModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const mongoose = require('mongoose')

const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { receiver, text } = req.body;
    const { conversationId } = req.params
    const userId = req.user.id;
    const users = [userId, receiver]

    const checkExistConversation = await Conversations.find({
        users: { $all: users }
    })

    if (checkExistConversation.length === 0) {
        return next(new ErrorHandler('Conversation not found', 404))
    }

    const data = await Messages.create({
        text,
        sender: userId,
        receiver,
        conversation: conversationId
    })

    if (data) {
        await Conversations.findByIdAndUpdate(conversationId, {
            $push: { messages: data }
        }, { new: true }).populate('sender').populate('receiver')

        return res.status(200).json({ success: true, message: data })
    }

    return next(new ErrorHandler("Failed to add message to the database", 400));
})

const getAllMessage = catchAsyncErrors(async (req, res, next) => {
    const { conversationId } = req.params;

    const conversation = await Conversations.find({
        _id: conversationId
    }).select('messages')

    if (!conversation) {
        return next(new ErrorHandler('Conversation not found', 404));
    }


    const messages = await Messages.find().where('conversation').in(conversation).populate('sender').populate('receiver').exec();


    return res.status(200).json({
        success: true,
        messages
    })


})

module.exports = {
    sendMessage,
    getAllMessage
}