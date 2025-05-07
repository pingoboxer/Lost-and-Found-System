const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {type: String, required: true},
    description: {type: String, required: true},
    locationFound: {type: String, required: true},
    dateFound: {type: Date, required: true},
    claimed: {type: Boolean, default: false}
}, {
    timestamps: true
})

const Item = new mongoose.model('Item', itemSchema);

module.exports = Item;

// The above code defines a Mongoose schema and model for an item in a lost and found system.
// The schema includes fields for the item's name, description, location where it was found, date it was found, and whether it has been claimed.
// The model is then exported for use in other parts of the application.
// The timestamps option automatically adds createdAt and updatedAt fields to the schema.
// This allows for easy tracking of when items were added and last updated.
// The claimed field is a boolean that indicates whether the item has been claimed by its owner.
