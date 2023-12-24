const asyncHandler = require('express-async-handler');
const EmergencyMedicalProfile = require('../models/EmergencyProfile');
const User = require('../models/userModel');
const aws = require("aws-sdk");
const multer = require('multer');
const multerS3 = require('multer-s3');
const UserProfilePic = require('../models/profilePicModel')
const { getSecret } = require('../config/getSecret');



// connect to aws s3
const setProfilePic = asyncHandler(async (req, res) => {
  try {
    const secretValue = await getSecret();
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_REGION } = JSON.parse(secretValue);

    const s3Bucket = new aws.S3({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: S3_REGION,
    });

    const upload = multer({
      storage: multerS3({
        s3: s3Bucket,
        bucket: "santehagguiprojectprofilepicsbucket-696700314561",
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, `images-${Date.now()}.jpeg`);
        },
      }),
    });

    const userID = req.user.id; 
    const uploadSingle = upload.single('images');

    uploadSingle(req, res, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(400).json({ success: false, message: err.message });
      }

      await UserProfilePic.create({
        photoUrl: req.file.location,
        user: userID
      })
      res.status(200).json({ success: true, data: req.file.location });
    });
  } catch (error) {
    console.error("An error occurred during S3 client initialization:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


  

// Call the function to initialize the S3 client

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
    async (req, res) => {
        const {
            name,
            birthday,
            gender,
            bloodType,
            allergies,
            medications,
            treatmentsAndProcedures,
            address,
            emergencyContactName,
            emergencyContactRelationship,
            emergencyContactPhone,
            emergencyContactAddress,
            notes,
        } = req.body;

        const userID = req.user.id;

        try {
            // Check if the user already has an emergency profile
            const existingEmergencyProfile = await EmergencyMedicalProfile.findOne({ user: userID });

            if (existingEmergencyProfile) {
                console.log('Existing emergency profile found');
                res.status(400).json({
                    error: 'Emergency profile already exists',
                });
            } else {
                // No existing emergency profile found, create a new one

                
                // Create the emergency profile with the uploaded image
                const newEmergencyProfile = await EmergencyMedicalProfile.create({
                    name,
                    birthday,
                    gender,
                    bloodType,
                    allergies,
                    medications,
                    treatmentsAndProcedures,
                    emergencyContactName,
                    emergencyContactRelationship,
                    emergencyContactPhone,
                    emergencyContactAddress,
                    address,
                    notes,
                    user: userID,
                });

                console.log('New emergency profile created:', newEmergencyProfile);

                res.status(201).json(newEmergencyProfile);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: 'Internal server error',
            });
        }
    }
);




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
  
        const { _id, name, birthday, gender, bloodType, allergies, medications, treatmentsAndProcedures, emergencyContactName, emergencyContactRelationship, emergencyContactPhone, emergencyContactAddress, address, notes } = req.body || {};
        const emergencyProfile = await EmergencyMedicalProfile.findById(req.body._id);
        const updatedEmergencyProfile = {};
  
        if (name) {
          updatedEmergencyProfile.name = name;
        }
  
        if (birthday) {
          updatedEmergencyProfile.birthday = birthday;
        }
  
        if (gender) {
          updatedEmergencyProfile.gender = gender;
        }
  
        if (bloodType) {
          updatedEmergencyProfile.bloodType = bloodType;
        }
  
        if (allergies) {
          updatedEmergencyProfile.allergies = allergies;
        }
  
        if (medications) {
          updatedEmergencyProfile.medications = medications;
        }
  
        if (treatmentsAndProcedures) {
          updatedEmergencyProfile.treatmentsAndProcedures = treatmentsAndProcedures;
        }
  
        if (emergencyContactName) {
          updatedEmergencyProfile.emergencyContactName = emergencyContactName;
        }
  
        if (emergencyContactRelationship) {
          updatedEmergencyProfile.emergencyContactRelationship = emergencyContactRelationship;
        }
  
        if (emergencyContactPhone) {
          updatedEmergencyProfile.emergencyContactPhone = emergencyContactPhone;
        }
  
        if (emergencyContactAddress) {
          updatedEmergencyProfile.emergencyContactAddress = emergencyContactAddress;
        }
  
        if (address) {
          updatedEmergencyProfile.address = address;
        }
  
        if (notes) {
          updatedEmergencyProfile.notes = notes;
        }

        const result = await EmergencyMedicalProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: updatedEmergencyProfile },
            { new: true }
        );

        res.status(200).json({
          result,
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


//@descr get userPic 
//@route GET /api/healthRecords/profile/pic
//@access Private

const getUserPic = asyncHandler(async (req, res) => {
    const userID = req.user.id;

    const userPic = await UserProfilePic.findOne({ user: userID });
    if (!userPic) {
        throw new Error('User profile picture not found');
    }

    res.status(200).json({userPic});
});

//@desc update userPic
//@route PUT /api/healthRecords/profile/pic
//@access Private

const updateUserPic = asyncHandler(async (req, res) => {
    const userID = req.user.id;

    const userPic = await UserProfilePic.findOne({ user: userID });
    if (!userPic) {
        throw new Error('User profile picture not found');
    }

    userPic.photUrl = req.body.photUrl;
    await userPic.save();

    res.status(200).json({ userPic });

});

//@desc delete userPic
//@route DELETE /api/healthRecords/profile/pic
//@access Private

const deleteUserPic = asyncHandler(async (req, res) => {
    const userID = req.user.id;

    const userPic = await UserProfilePic.findOne({ user: userID });
    if (!userPic) {
        throw new Error('User profile picture not found');
    }

    await userPic.remove();

    res.status(200).json({ message: 'User profile picture deleted successfully' });

})

module.exports=  {
    getAllEmergencyProfiles,
    createUserEmergencyProfile,
    updateUserEmergencyProfile,
    getUserEmergencyUniqueProfile,
    deleteUserEmergencyProfile,
    setProfilePic,
    getUserPic,
    updateUserPic,
    deleteUserPic
    
}
