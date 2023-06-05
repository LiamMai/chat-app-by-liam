const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Users'
        }
    ],
    groupOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Messages'
        }
    ],
});

const Friend = mongoose.model('Conversations', conversationSchema);

module.exports = Friend;