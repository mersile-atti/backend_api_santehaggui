const expres = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const router = expres.Router();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const aws = require("aws-sdk");
const multer = require('multer');
const multerS3 = require('multer-s3');
const UserProfilePic = require('../models/profilePicModel')
const { getSecret } = require('../config/getSecret');

const storage = multer.memoryStorage();
const upload = multer({storage: storage})



const { 
    getAllEmergencyProfiles,
    createUserEmergencyProfile,
    updateUserEmergencyProfile,
    getUserEmergencyUniqueProfile,
    deleteUserEmergencyProfile,
} = require('../controllers/healthRecordsControllers');
const {
    getUserHealthMetrics,
    createNewHealthMetrics,
    updateHealthMetrics
} = require('../controllers/heathMetricsControllers');
const validateToken = require('../middleware/validateTokenHandler');



router.use(validateToken);

router.get('/', getAllEmergencyProfiles)
router.route('/profile').get(getUserEmergencyUniqueProfile).post(createUserEmergencyProfile).put(updateUserEmergencyProfile).delete(deleteUserEmergencyProfile);
router.route('/metrics').get(getUserHealthMetrics).post(createNewHealthMetrics).put(updateHealthMetrics);
router.route('/profile/pic').get(asyncHandler(async (req, res) => {
    const userID = req.user.id;

    const userPic = await UserProfilePic.findOne({ user: userID });
    if (!userPic) {
        throw new Error('User profile picture not found');
    }

    res.status(200).json({userPic});
})
).post(upload.single('image'), asyncHandler(async (req, res) => {
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

     req.file.buffer;

     const params = {
        Bucket: "santehagguiprojectprofilepicsbucket-696700314561",
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    }

     const commande = new PutObjectCommand(params);
     const data = await s3Bucket.send(commande);

     const userID = req.user.id; 

     await UserProfilePic.create({
        photoUrl: req.file.originalname,
        user: userID
      });

     res.status(200).json({
        success: true,
        data: req.file.originalname,
        message: "File uploaded successfully",
     })
    } catch (error) {
      console.error("An error occurred during S3 client initialization:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }));
module.exports = router;