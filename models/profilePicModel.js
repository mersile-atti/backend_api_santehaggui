const mongoose = require('mongoose');

const UserProfilePictureSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photoUrl: String,
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('UserProfilePic', UserProfilePictureSchema);