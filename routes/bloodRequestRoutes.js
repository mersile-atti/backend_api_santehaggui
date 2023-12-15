const express = require('express');
const router = express.Router();
const { createBloodRequest,
    getAllBloodRequests,
    getBloodRequest,
    updateBloodRequest,
    deleteBloodRequest,
    respondToBloodDonationRequest
} = require('../controllers/bloodRequestControllers');
const validateToken = require('../middleware/validateTokenHandler');



router.use(validateToken);

router.route('/').get(getAllBloodRequests).post(createBloodRequest).put(updateBloodRequest);
router.route('/update').put(updateBloodRequest);
router.route('/:id').delete(deleteBloodRequest);
router.route('/respond/:id').post(respondToBloodDonationRequest)
router.route('/current').get(getBloodRequest);
module.exports = router;