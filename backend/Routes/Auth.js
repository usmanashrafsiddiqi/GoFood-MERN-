const express = require('express');
const User = require('../models/User');
const Order = require('../models/Orders');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fetch = require('../middleware/fetchdetails');
const jwtSecret = process.env.JWT_SECRET || "HaHa"; // Use environment variable

// Creating a user and storing data to MongoDB, No Login Required
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, location } = req.body;

    try {
        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(password, salt);
        
        const user = await User.create({ name, password: securePass, email, location });
        const authToken = jwt.sign({ user: { id: user.id } }, jwtSecret);
        res.json({ success: true, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Server error." });
    }
});

// Authenticating a User, No Login Required
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid credentials." });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success: false, error: "Invalid credentials." });
        }

        const authToken = jwt.sign({ user: { id: user.id } }, jwtSecret);
        res.json({ success: true, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get logged in User details, Login Required
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get location from lat/long
router.post('/getlocation', async (req, res) => {
    const { latlong } = req.body;

    if (!latlong || !latlong.lat || !latlong.long) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        const { lat, long } = latlong;
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${process.env.OPENCAGE_API_KEY}`);
        const { village, county, state_district, state, postcode } = response.data.results[0].components;
        const location = `${village}, ${county}, ${state_district}, ${state}, ${postcode}`;
        res.json({ location });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Fetch food data
router.post('/foodData', async (req, res) => {
    try {
        res.json([global.foodData, global.foodCategory]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Handle order data
router.post('/orderData', async (req, res) => {
    const { order_data, order_date, email } = req.body;

    if (!email || !order_data) {
        return res.status(400).json({ error: "Email and order data are required." });
    }

    try {
        order_data.unshift({ Order_date: order_date });
        const eId = await Order.findOne({ 'email': email });

        if (!eId) {
            await Order.create({ email, order_data: [order_data] });
        } else {
            await Order.findOneAndUpdate({ email }, { $push: { order_data } });
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get user's order data
router.post('/myOrderData', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        const eId = await Order.findOne({ 'email': email });
        res.json({ orderData: eId });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
