const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDb Connect: ${conn.connection.host}, ${conn.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1);    
    }
};

module.exports = connectDB;