const expres = require('express');
const router = expres.Router();


const { 
    getAllEmergencyProfiles,
    createUserEmergencyProfile,
    updateUserEmergencyProfile,
    getUserEmergencyUniqueProfile,
    deleteUserEmergencyProfile,
    setProfilePic,
    getUserPic,
    updateUserPic
    
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
router.route('/profile/pic').get(getUserPic).post(setProfilePic).put(updateUserPic);
module.exports = router;