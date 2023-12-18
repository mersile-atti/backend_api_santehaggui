const asyncHandler = require('express-async-handler');
const BloodDonationRequest = require('../models/bloodRequestModel');
const User = require('../models/userModel');
// @desc    Create blood request
// @route   POST /api/bloodrequest
// @access  Private/users
const createBloodRequest = asyncHandler(
    async(req, res) => {
        const {
        bloodType,
        hospitalName,
        hospitalLocation,
        urgency,
        pintsNeeded,
        diagnosis,
        shortDescription,
        } = req.body;

        const userID = req.user.id;
        try {

            const newRequest = await BloodDonationRequest.create({
                bloodType,
                hospitalName,
                hospitalLocation,
                urgency,
                pintsNeeded,
                diagnosis,
                shortDescription,
                user: userID
            });
            console.log("New request created!");
            res.status(201).json(newRequest);
        } catch (error) {
            console.log('Failed to create', error)
            res.status(500).json({
                error: "Failed to create a new Request"
            })
        }});

//desc    Get all blood requests
//route   GET /api/bloodrequest
//access  Public
const getAllBloodRequests = asyncHandler(
    async (req, res) => {
        try {
            // Fetch all blood donation requests from the database
            const bloodRequests = await BloodDonationRequest.find();

            res.status(200).json(bloodRequests);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

//desc    Get a single blood request
//route   GET /api/bloodrequest/:id
//access  Private
const getBloodRequest = asyncHandler(
    async (req, res) => {
        const userID = req.user.id;
            const bloodRequest = await BloodDonationRequest.findOne({user: userID});
            if(!bloodRequest) {
                res.status(404).json({ error: 'No Blood Request Found' });
            }
            res.status(200).json(bloodRequest);

    }
);

//@desc    Update a blood request
//@route   PUT /api/bloodrequest/
//@access  Private
const updateBloodRequest = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user.id);
        if(user) {
            try {
                const { _id, ...updateData } = req.body || {};
                const updatedBloodRequest = await BloodDonationRequest.findOneAndUpdate(
                    {user: req.user.id}, 
                    {$set: updateData}, 
                    {new: true}
                );
                res.status(200).json(updatedBloodRequest);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
                console.log(error);
                throw new Error(error); 
            }
        } else {s
            res.status(401);
            throw new Error('User not found'); 
        }
    });

//@desc    Delete a blood request
//@route   DELETE /api/bloodrequest/
//@access  Private

const deleteBloodRequest = asyncHandler(
    async (req, res) => {
        const bloodRequestID = req.params.id;
        const existingBloodRequest = await BloodDonationRequest.findById(bloodRequestID);
        if(!existingBloodRequest) {
            res.status(404);
            throw new Error('Blood Request not found');
        }
        await BloodDonationRequest.findByIdAndDelete(bloodRequestID);
        res.status(200).json({
            Message: `Successfully deleted Blood Request with ID ${bloodRequestID}`
        });
    }
);

//@desc Response to blood request
//@route PUT /api/bloodrequest/response/:id
//@access Private
const respondToBloodDonationRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.id; // Assuming the request ID is in the URL parameters
    const responderId = req.user.id;

    try {
        const updatedRequest = await BloodDonationRequest.findByIdAndUpdate(
            requestId,
            { $addToSet: { responders: responderId } },
            { new: true }
        );

        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ error: 'Failed to respond to blood donation request' });
    }
});


module.exports = {
    createBloodRequest,
    getAllBloodRequests,
    getBloodRequest,
    updateBloodRequest,
    deleteBloodRequest,
    respondToBloodDonationRequest
}