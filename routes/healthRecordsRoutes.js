const expres = require('express');
const router = expres.Router();
const { 
    getAllEmergencyProfiles,
    createUserEmergencyProfile,
    updateUserEmergencyProfile,
    getUserEmergencyUniqueProfile,
    deleteUserEmergencyProfile
} = require('../controllers/healthRecordsControllers');
const validateToken = require('../middleware/validateTokenHandler');


router.use(validateToken);

router.get('/', getAllEmergencyProfiles)
router.route('/profile').get(getUserEmergencyUniqueProfile).post(createUserEmergencyProfile).put(updateUserEmergencyProfile).delete(deleteUserEmergencyProfile);

module.exports = router;