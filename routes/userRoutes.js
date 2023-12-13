const express = require('express');
const router = express.Router();

const {
    registerUser,
    authUser,
    currentUser,
    updateUser,
    deleteUser,
    logoutUser
} = require('../controllers/userControllers');
const validateToken = require('../middleware/validateTokenHandler');


router.post('/', registerUser);
router.post('/login', authUser);
router.get('/current', validateToken ,currentUser);
router.put('/update', validateToken, updateUser);
router.delete('/delete', validateToken, deleteUser);
router.post('/logout', validateToken, logoutUser);
module.exports = router;