const mongoose = require('mongoose');

// Use environment variable for MongoDB URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gofoodmern';

const mongoDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

const fetchData = async () => {
    try {
        const foodItems = await mongoose.connection.db.collection("fooditems").find({}).toArray();
        const foodCategory = await mongoose.connection.db.collection("foodcategory").find({}).toArray();

        // Store fetched data in global variables
        global.fooditems = foodItems;
        global.foodCategory = foodCategory;
    } catch (err) {
        console.error("Error fetching data:", err);
    }
};

module.exports = { mongoDB, fetchData };
