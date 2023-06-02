const mongoose = require('mongoose');
const UserVerification = mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date
})

module.exports = mongoose.model('UserVerification', UserVerification)