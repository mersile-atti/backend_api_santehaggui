const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const HealthMetrics = require('../models/healthMetricsModel');

// @desc    Get user health metrics
// @route   GET /api/healthRecords/health-metrics
// @access  Private

const getUserHealthMetrics = asyncHandler(async (req, res) => {
    const userID = req.user.id;
    const healthMetrics = await HealthMetrics.find({ user: userID });

    res.status(200).json(healthMetrics);

});

//@desc Create a new health metrics
//@route POST /api/healthRecords/health-metrics
//@access Public

const createNewHealthMetrics = asyncHandler(async (req, res) => {
    const {
    metricsDate,
    weight,
    height,
    bloodPressure,
    heartRate,
    bodyTemperature,
    bloodSugar,
    cholesterol,
    medicalHistory,
    physicalActivity,
    nutrition,   
    indiceMasseCorporelle,
    systolicPressionArterielle,
    distolicPressionArterielle,
    ldlCholesterol,
    hdlCholesterol,
    triglycerides,
    rapportTotalCholesAndHdl, 
    waistCircumference,
    } = req.body;

    const userID = req.user.id;
    try {
        const existingMetrics = await HealthMetrics.findOne({ user: userID });
        if (existingMetrics) {
            res.status(400).json({ error: 'Health metrics already exist' });
        } else {
            const newHealthMetrics = await HealthMetrics.create({
                metricsDate,
                weight,
                height,
                bloodPressure,
                heartRate,
                bodyTemperature,
                bloodSugar,
                cholesterol,
                medicalHistory,
                physicalActivity,
                nutrition,
                indiceMasseCorporelle,
                systolicPressionArterielle,
                distolicPressionArterielle,
                ldlCholesterol,
                hdlCholesterol,
                triglycerides,
                rapportTotalCholesAndHdl,
                waistCircumference,
                user: userID,
            });
            console.log('New Health metrics created:', newHealthMetrics);
            res.status(201).json(newHealthMetrics);
        }
         
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        throw new Error('Internal server error');  
    
    }
});

//@desc Update a health metrics
//@route PUT /api/healthRecords/health-metrics
//@access Private

const updateHealthMetrics = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        try {
            const healthmetricsExist = await HealthMetrics.exists({ user: req.user.id });
            if (!healthmetricsExist) {
                throw new Error('Health metrics does not exist for this user');
            }
            const {_id,
                weight,
                height,
                bloodPressure,
                heartRate,
                bloodSugar,
                cholesterol,
                medicalHistory,
                physicalActivity,
                nutrition,
                indiceMasseCorporelle,
                systolicPressionArterielle,
                distolicPressionArterielle,
                ldlCholesterol,
                hdlCholesterol,
                triglycerides,
                rapportTotalCholesAndHdl,
                waistCircumference,
             } = req.body || {};
             const healthMetrics = await HealthMetrics.findById(req.body_id);
             const updatedHealthMetrics = {};

             if (weight) {
                updatedHealthMetrics.weight = weight;
             }
             if (height) {
                updatedHealthMetrics.height = height;
             }
             if (bloodPressure) {
                updatedHealthMetrics.bloodPressure = bloodPressure;
             }
             if (heartRate) {
                updatedHealthMetrics.heartRate = heartRate;
             }
           
             if (bloodSugar) {
                updatedHealthMetrics.bloodSugar = bloodSugar;
             }
             if (cholesterol) {
                updatedHealthMetrics.cholesterol = cholesterol;
             }
             if (medicalHistory) {
                updatedHealthMetrics.medicalHistory = medicalHistory;
             }
             if (physicalActivity) {
                updatedHealthMetrics.physicalActivity = physicalActivity; 
            } 
            if (nutrition) {
                updatedHealthMetrics.nutrition = nutrition;
            }
            if(indiceMasseCorporelle) {
                updatedHealthMetrics.indiceMasseCorporelle = indiceMasseCorporelle;
            }
           
            if(systolicPressionArterielle) {
                updatedHealthMetrics.systolicPressionArterielle = systolicPressionArterielle;
            } 
            if(distolicPressionArterielle) {
                updatedHealthMetrics.distolicPressionArterielle = distolicPressionArterielle;
            }
            if(ldlCholesterol) {
                updatedHealthMetrics.ldlCholesterol = ldlCholesterol;
            }
            if(hdlCholesterol) {
                updatedHealthMetrics.hdlCholesterol = hdlCholesterol;
            }
            if(triglycerides) {
                updatedHealthMetrics.triglycerides = triglycerides;
            }
            if(rapportTotalCholesAndHdl) {
                updatedHealthMetrics.rapportTotalCholesAndHdl = rapportTotalCholesAndHdl;
            }
            if(waistCircumference) {
                updatedHealthMetrics.waistCircumference = waistCircumference;
            }
            const result = await HealthMetrics.findOneAndUpdate(
                { user: req.user.id},
                { $set: updatedHealthMetrics },
                { new: true });
            res.status(200).json({
                result
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });     
        }
    } else {
        res.status(404).json({ error: 'User not found' });
    }
})


module.exports = { 
    getUserHealthMetrics,
    createNewHealthMetrics,
    updateHealthMetrics
};