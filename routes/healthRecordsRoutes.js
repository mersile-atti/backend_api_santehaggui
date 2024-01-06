const expres = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const router = expres.Router();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const sharp = require('sharp');
const aws = require("aws-sdk");
const s3 = new aws.S3();
const multer = require('multer');
const multerS3 = require('multer-s3');
const UserProfilePic = require('../models/profilePicModel')
const { getSecret } = require('../config/getSecret');

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')




const { 
    getAllEmergencyProfiles,
    createUserEmergencyProfile,
    updateUserEmergencyProfile,
    getUserEmergencyUniqueProfile,
    getEmergencyProfileURL,
    deleteUserEmergencyProfile,
} = require('../controllers/healthRecordsControllers');
const {
    getUserHealthMetrics,
    createNewHealthMetrics,
    updateHealthMetrics
} = require('../controllers/heathMetricsControllers');
const validateToken = require('../middleware/validateTokenHandler');



router.get('/', validateToken, getAllEmergencyProfiles)
router.get('/profile-url', validateToken, getEmergencyProfileURL)
router.route('/profile').get(getUserEmergencyUniqueProfile).post(validateToken, createUserEmergencyProfile).put(validateToken, updateUserEmergencyProfile).delete(validateToken, deleteUserEmergencyProfile);
router.route('/metrics').get(validateToken, getUserHealthMetrics).post(validateToken, createNewHealthMetrics).put(validateToken, updateHealthMetrics);
router.route('/profile/pic').get(validateToken, asyncHandler(async (req, res) => {
    const userID = req.user.id;

    const userPic = await UserProfilePic.findOne({ user: userID });
    if (!userPic) {
        throw new Error('User profile picture not found');
    }

    res.status(200).json({userPic});
})
).post(validateToken, upload.single('image'), asyncHandler(async (req, res) => {
  try {
    const secretValue = await getSecret();
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_REGION } = JSON.parse(secretValue);

    const s3Bucket = new S3Client({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: S3_REGION,
    });
  
    const file = req.file 
  
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer()
  
    // Configure the upload details to send to S3
    const fileName = generateFileName()

   const uploadParams = {
      Bucket: "santehagguiprojectprofilepicsbucket-696700314561",
      Body: fileBuffer,
      Key: fileName,
      ContentType: file.mimetype
  }

   // Send the upload to S3
  await s3Bucket.send(new PutObjectCommand(uploadParams));
  const imageURL = `https://s3.amazonaws.com/santehagguiprojectprofilepicsbucket-696700314561/${fileName}`;


   const userID = req.user.id; 
  // Save the image URL to MongoDB
  await UserProfilePic.create({
    photoUrl: imageURL,
    user: userID,
  });

  res.status(200).json({
    success: true,
    data: imageURL,
    message: "Image uploaded and saved successfully",
  });
 
  } catch (error) {
    console.error("An error occurred during S3 client initialization:", error);
    res.status(500).json({ success: false, message: error});
  }
}));

module.exports = router;