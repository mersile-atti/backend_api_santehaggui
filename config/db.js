const mongoose = require('mongoose');

const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager({ region: 'eu-north-1' });

const secretName = 'prod/backend/mongodb';

secretsManager.getSecretValue({
  SecretId: secretName
}).then(data => {
  const mongoUri = JSON.parse(data.SecretString).value;
  process.env.MONGO_URI = mongoUri;

  const mongoose = require('mongoose');

  connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI)
      console.log(`MongoDb Connect: ${conn.connection.host}, ${conn.connection.name}`);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

  module.exports = connectDB;
}).catch(error => {
  console.error(error);
});


module.exports = connectDB;