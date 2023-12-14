const mongoose = require('mongoose');

const EmergencyMedicalProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    profilePicture: String,
    name: String,
    birthday: String,
    gender: String,
    bloodType: String,
    allergies: String,
    medications: String,
    treatmentsAndProcedures: String,
    address: String,
    emergencyContactName: String,
    emergencyContactRelationship: String,
    emergencyContactPhone: String,
    emergencyContactAddress: String,
    notes: String,
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('EmergencyMedicalProfile', EmergencyMedicalProfileSchema);