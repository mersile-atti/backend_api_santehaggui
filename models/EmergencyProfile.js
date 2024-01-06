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

const EmergencyMedicalProfileSchema = mongoose.Schema({
    umi: {type: String, unique: true, required: true, default: generateUMI},
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