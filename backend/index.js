const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const { mongoDB, fetchData } = require('./db'); // Import functions from db.js
const app = express();
const port = process.env.PORT || 5000;

// CORS middleware
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// API route to fetch products
app.get('/api/products', async (req, res) => {
    try {
        const foodItems = await mongoose.connection.db.collection("fooditems").find({}).toArray();
        res.json(foodItems); // Send fetched items as a JSON response
    } catch (error) {
        console.error("Error fetching products:", error); // Log the error details
        res.status(500).json({ message: "Error fetching products", error: error.message }); // Include the error message in the response
    }
});

// API routes
app.use('/api/auth', require('./Routes/Auth'));

const axios = require('axios');

app.get('/api/analyze', async (req, res) => {
    try {
        const response = await axios.get('https://api.ciuvo.com/api/analyze', { 
            params: {
                url: req.query.url,
                version: req.query.version,
                tag: req.query.tag,
                uuid: req.query.uuid,
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const startServer = async () => {
    await mongoDB(); // Establish MongoDB connection
    await fetchData(); // Fetch data after connection
    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
};

startServer(); // Call the function to start the server
