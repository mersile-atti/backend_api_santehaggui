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

app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'https://frontend-santehaggui.vercel.app/');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });


app.use('/api/healthRecords', require('./routes/healthRecordsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blood-requests', require('./routes/bloodRequestRoutes'));



app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => {
    console.log(`The backend server of santehaggui project listen on port ${PORT}`);
})