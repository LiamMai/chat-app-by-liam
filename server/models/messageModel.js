const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    text: {
        type: String,
        default: null
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    messageParentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Messages', messageSchema);