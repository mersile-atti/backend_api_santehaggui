const mongoose = require('mongoose');

const UserProfilePictureSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photUrl: String,
});

module.exports = mongoose.model('UserProfilePic', UserProfilePictureSchema);