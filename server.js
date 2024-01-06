const express = require('express');
const cors = require('cors');



const dotenv = require('dotenv');
const connectDB  = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');



dotenv.config();





// Load the service account key file


const PORT = process.env.PORT || 5002; 


connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow cross-origin requests
const corsOptions = {
    "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204// some legacy browsers (IE11, various SmartTVs) choke on 204
  }


app.use('/api/healthRecords',cors(corsOptions), require('./routes/healthRecordsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blood-requests', require('./routes/bloodRequestRoutes'));



app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => {
    console.log(`The backend server of santehaggui project listen on port ${PORT}`);
})