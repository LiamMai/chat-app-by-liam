const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const Conversations = require('../models/conversationModel')
const User = require('../models/userModel')

const createConversation = catchAsyncErrors(async (req, res, next) => {
    const { receiver } = req.body
    const user = await User.findById(receiver).exec();

    if (!user) {
        return next(new ErrorHandler('Receiver is not found', 404));
    }

    const userId = req.user.id;
    const users = [userId, receiver]

    const checkExistConversation = await Conversations.find({
        users: { $all: users }
    })

    if (checkExistConversation.length !== 0) {
        return next(new ErrorHandler('Conversation is already exists', 400));
    }

    const conversation = await Conversations.create({
        users,
    })

    return res.status(200).json({
        success: true,
        conversation
    })

})

module.exports = {
    createConversation
}