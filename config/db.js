const mongoose = require('mongoose');
const { getSecret } = require('./getSecret');

const connectDB = async () => {
    try {
        const secretValue = await getSecret();

        const secretObject = JSON.parse(secretValue);

        const conn = await mongoose.connect(secretObject.MONGO_URI);
        console.log(`MongoDb Connect: ${conn.connection.host}, ${conn.connection.name}`);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion à MongoDB :", error);
        process.exit(1);
    }
};

module.exports = connectDB;
