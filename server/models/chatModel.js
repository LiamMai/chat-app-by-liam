const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);