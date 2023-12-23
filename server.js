const express = require('express');




const dotenv = require('dotenv');
const connectDB  = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');



dotenv.config();



const {
    SecretsManagerClient,
    GetSecretValueCommand,
  } = require('@aws-sdk/client-secrets-manager');
  
  const secret_name = "prod/backend/santehaggui";
  
  const client = new SecretsManagerClient({ region: "eu-north-1" });
  
  const getSecretValuePromise = () => {
    return new Promise((resolve, reject) => {
      client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        }),
        (error, response) => {
          if (error) {
            reject(error);
          } else {
            const secretData = JSON.parse(response.SecretString);
            resolve({ secret: secretData.value });
          }
        }
      );
    });
  };
  
  getSecretValuePromise()
    .then((secretData) => {
      console.log('Secret value:', secretData.secret);
    })
    .catch((error) => {
      console.error('Error retrieving secret:', error);
    });


// Load the service account key file


const PORT = process.env.PORT || 5002; 


connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/healthRecords', require('./routes/healthRecordsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blood-requests', require('./routes/bloodRequestRoutes'));



app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => {
    console.log(`The backend server of santehaggui project listen on port ${PORT}`);
})