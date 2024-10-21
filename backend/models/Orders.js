const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define a schema for order items
const OrderItemSchema = new Schema({
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'fooditem', // Assuming you have a fooditem model
        required: true
    },
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: 1 // Ensure at least one item is ordered
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
}, { _id: false }); // Disable automatic _id generation for sub-documents

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    order_data: {
        type: [OrderItemSchema], // Use the structured OrderItemSchema
        required: true,
    },
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('Order', OrderSchema);
