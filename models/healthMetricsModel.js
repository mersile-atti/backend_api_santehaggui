const mongoose = require("mongoose");

const healthMetricsSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    metricsDate: { type: Date, default: Date.now },
    weight: String,
    height: String,
    bloodPressure: String,
    heartRate: String,
    bodyTemperature: String,
    bloodSugar: String,
    cholesterol: String,
    medicalHistory: String,
    physicalActivity: String,
    nutrition: String,   
    indiceMasseCorporelle: String,
    systolicPressionArterielle: String,
    distolicPressionArterielle: String,
    ldlCholesterol: String,
    hdlCholesterol: String,
    triglycerides: String,
    rapportTotalCholesAndHdl: String, 
    waistCircumference: String,
  },
    {timestamps: true}
  );


  
module.exports = mongoose.model('HealthMetrics', healthMetricsSchema);
  