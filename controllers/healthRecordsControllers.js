const asyncHandler = require('express-async-handler');
const EmergencyMedicalProfile = require('../models/EmergencyProfile');
const User = require('../models/userModel');


//@desc Get all emergies profiles
//@route GET /api/healthRecords
//@access Public

const getAllEmergencyProfiles = asyncHandler(
    async(req, res) => {
        const userID = req.user.id;
        const emergencyProfiles = await EmergencyMedicalProfile.findOne({user: userID});
        res.json({
            emergencyProfiles
        })
    }
);



//@desc Create a new emergency Profile
//@route POST /api/healthRecords/profile
//@access Public

const createUserEmergencyProfile = asyncHandler(
    async(req, res) => {
        const {
            profilePicture,
            name,
            birthday,
            gender,
            bloodType,
            allergies,
            medications,
            treatmentsAndProcedures,
            address,
            emergencyContact,
            notes
        } = req.body;

        const userID = req.user.id;

        try {
            // Check if the user already has an emergency profile
            const existingEmergencyProfile = await EmergencyMedicalProfile.findOne({user: userID});

            if (existingEmergencyProfile) {
                console.log('Existing emergency profile found');
                res.status(400).json({
                    error: 'Emergency profile already exists',
                });
            } else {
                // No existing emergency profile found, create a new one
                console.log('Creating a new emergency profile');

                const newEmergencyProfile = await EmergencyMedicalProfile.create({
                    profilePicture,
                    name,
                    birthday,
                    gender,
                    bloodType,
                    allergies,
                    medications,
                    treatmentsAndProcedures,
                    address,
                    emergencyContact,
                    notes,
                    user: userID,
                });

                console.log('New emergency profile created:', newEmergencyProfile);

                res.status(201).json(newEmergencyProfile);
            }
        } catch (err) {
            res.status(500).json({
                error: 'Internal server error',
            });
        }
    });



//@desc Get an unique emergency Profile
//@route GET /api/healthRecords/profile/:id
//@access Private
const getUserEmergencyUniqueProfile = asyncHandler(
    async(req, res) => {
        const userID = req.user.id;
        const emergencyProfiles = await EmergencyMedicalProfile.findOne({user: userID});
        res.json({
            emergencyProfiles
        })
    }
);


// Update Emergency Profile Function
//@desc Update an emergency Profile
//@route PUT /api/healthRecords/profile/
const updateUserEmergencyProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        try {
            const emergencyProfileExists = await EmergencyMedicalProfile.exists({
                user: req.user.id
            });

            if (!emergencyProfileExists) {
                throw new Error('Emergency Profile does not exist for this user');
            }

            const { _id, ...updateData } = req.body || {};
            const updatedEmergencyProfile = await EmergencyMedicalProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: updateData },
                { new: true }
            );
            res.status(200).json({
                updatedEmergencyProfile,
            });
        } catch (err) {
            res.status(400).json({
                error: err.message
            });
        }
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});


//@desc Ddelete an emergency Profile
//@route Delete /api/healthRecords/profile/:id
//@access Private

const deleteUserEmergencyProfile = asyncHandler(
    async(req, res) => {
        const emergencyProfileID = req.params.id;

        // Check if the emergency profile with the specified ID exists
        const existingEmergencyProfile = await EmergencyMedicalProfile.findById(emergencyProfileID);

        if (!existingEmergencyProfile) {
            res.status(404);
            throw new Error('Emergency profile not found');
        }

        await EmergencyMedicalProfile.findByIdAndDelete(emergencyProfileID);

        res.status(200).json({
            message: `Successfully deleted Emergency Profile with ID ${emergencyProfileID}`
        })
    });



module.exports=  {
    getAllEmergencyProfiles,
    createUserEmergencyProfile,
    updateUserEmergencyProfile,
    getUserEmergencyUniqueProfile,
    deleteUserEmergencyProfile
}