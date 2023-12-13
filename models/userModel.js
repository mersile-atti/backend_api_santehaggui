const mongoose = require('mongoose');

function generateUMI() {
    const characters= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const umiLength = 10;

    let umi = '';
    for (let i = 0; i < umiLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        umi += characters[randomIndex];
    }
    return umi;
}

const userSchema = mongoose.Schema({
    umi: {type: String, unique: true, required: true, default: generateUMI},
    username: {type: String, required: [true, "Username is required"]},
    email: {type: String, required: [true, "Email is required"]},
    phone: {type: String, required: [true, "Phone is required"]},
    password: {type: String, required: [true, "Password is required"]}
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);

