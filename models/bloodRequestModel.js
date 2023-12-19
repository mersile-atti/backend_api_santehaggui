const mongoose = require('mongoose');

const bloodDonationRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bloodType: { type: String, required: true },
    hospitalName: { type: String, required: true },
    hospitalLocation: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' }, // You can have different statuses like 'Open', 'Fulfilled', 'Closed', etc.
    responders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to users responding to the request
    createdAt: String,
    urgency: { type: String, enum: ['Accident/Emergency', 'Chemotherapy', 'Maternity', 'Surgery'], required: [true, 'Urgency is required'],},
    pintsNeeded: { type: Number, required: true },
    diagnosis: String,
    shortDescription: String,
}, {timestamps: true}
);


module.exports  = mongoose.model('BloodDonationRequest', bloodDonationRequestSchema);
