const Friend = require('../models/friendModel');
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")

const sendFriendRequest = catchAsyncErrors(async (req, res, next) => {
    const { friendId } = req.params;
    const userId = req.user.id;

    const existingFriend = await Friend.findOne({ sender: userId, receiver: friendId });

    if (friendId === userId) {
        return next(new ErrorHandler('Can\'t send friend request to your self', 400));
    }

    if (existingFriend) {
        return next(new ErrorHandler('Friend request already sent!!!', 400));
    }

    const friend = new Friend({ sender: userId, receiver: friendId });
    await friend.save();

    return res.status(201).json({ friend })
})

const acceptFriendRequest = catchAsyncErrors(async (req, res, next) => {
    const { friendRequestId } = req.params;
    const userId = req.user.id;

    const friend = await Friend.findOneAndUpdate(
        { _id: friendRequestId },
        { $set: { status: 'accepted' } },
        { new: true }
    );

    if (!friend) {
        return next(new ErrorHandler('Friend request not found', 404))
    }

    if (userId === friend.sender._id.toString()) {
        return next(new ErrorHandler('You can\'t accept friend to your self!!!', 404))
    }

    return res.status(200).json({ friend })
})


const rejectFriendRequest = catchAsyncErrors(async (req, res, next) => {
    const { friendRequestId } = req.params;
    const userId = req.user.id;

    const friend = await Friend.findOneAndUpdate(
        { _id: friendRequestId },
        { $set: { status: 'rejected' } },
        { new: true }
    );

    if (!friend) {
        return next(new ErrorHandler('Friend request not found', 404))
    }

    if (userId === friend.sender._id.toString()) {
        return next(new ErrorHandler('You can\'t rejected friend to your self!!!', 404))
    }

    return res.status(200).json({ friend })
})

const getFriends = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const friends = await Friend.find({ $or: [{ sender: userId }, { receiver: userId }], accepted: true })
        .populate('sender', 'name')
        .populate('receiver', 'name');
    return res.status(200).json({ friends });
})

const searchFriends = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const searchQuery = req.query.q;

    if (!searchQuery) {
        return next(new ErrorHandler('Please typing name', 400));
    }

    const regex = new RegExp(searchQuery, 'i');

    const matchingUsers = await User.find({ name: regex }).exec();

    const friendRequests = await Friend.find({
        $and: [
            { $or: [{ sender: userId }, { receiver: userId }] },
            { status: 'accepted' },
        ],
    }).exec();

    const friendIds = friendRequests.map((request) =>
        request.sender.equals(userId) ? request.receiver : request.sender
    );

    const nonFriendUsers = matchingUsers.filter((user) => !friendIds.includes(user._id.toString()) && user._id !== userId);

    return res.json({
        success: true,
        friends: friendIds,
        nonFriends: nonFriendUsers
    })
})

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    getFriends,
    searchFriends,
    rejectFriendRequest
}
