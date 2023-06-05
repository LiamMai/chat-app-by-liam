const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    users: {
        type: Array,
        required: true,
    },
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