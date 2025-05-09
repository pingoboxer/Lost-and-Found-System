// Importing required modules
const express = require('express') // Express framework for building APIs
const mongoose = require('mongoose') // Mongoose for MongoDB interaction

// Importing the Item model
const Item = require('./itemModel')

// Initializing the Express app
const app = express()
app.use(express.json()) // Middleware to parse JSON request bodies

// Setting up the server port
const PORT = process.env.PORT || 3000

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://terngukpamor:0SHjuPyX9rRw4GrR@cluster0.dwwhrnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// Connecting to MongoDB and starting the server
mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB') // Log successful connection
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`) // Log server start
    })
})

// Root route to confirm API is running
app.get('/', (req, res) => {
    res.json({message: 'Welcome to the Lost and Found API System'}) // Welcome message
})

// Route to add a new found item
app.post('/add-items', async (req, res) => {
    const { itemName, description, locationFound, dateFound } = req.body

    // Validate required fields
    if (!itemName || !description || !locationFound || !dateFound) {
        return res.status(400).json({ message: 'All fields are required' }) // Return error if validation fails
    }

    // Create a new item document
    const newItem = new Item({
        itemName,
        description,
        locationFound,
        dateFound,
    });

    // Save the item to the database
    await newItem.save()

    // Respond with success message and the created item
    res.status(201).json({ message: 'Found item successfully added', item: newItem })
})

// Route to fetch all unclaimed items
app.get('/unclaimed-items', async (req, res) => {
    const unclaimedItems = await Item.find({ claimed: false }) // Query for unclaimed items

    // Check if no unclaimed items are found
    if (unclaimedItems.length === 0) {
        return res.status(404).json({ message: 'No unclaimed items found' }) // Return error if none found
    }

    // Respond with the list of unclaimed items
    res.status(200).json({ items: unclaimedItems })
})

// Route to find a specific item by ID
app.get('/find-item/:id', async (req, res) => {
    const { id } = req.params

    // Validate if ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Item ID is required' }) // Return error if ID is missing
    }

    // Find the item by ID
    const item = await Item.findById(id)
    if (!item) {
        return res.status(404).json({ message: 'Item not found' }) // Return error if item is not found
    }

    // Respond with the found item
    res.status(200).json({ item })
})

// Route to claim an item by ID
app.put('/claim-item/:id', async (req, res) => {
    const { id } = req.params

    // Validate if ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Item ID is required' }) // Return error if ID is missing
    }

    // Find the item by ID
    const item = await Item.findById(id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' }) // Return error if item is not found
    }

    // Check if the item is already claimed
    if (item.claimed) {
        return res.status(400).json({ message: 'Item has already been claimed' }) // Return error if already claimed
    }

    // Mark the item as claimed
    item.claimed = true
    await item.save()

    // Respond with success message and the updated item
    res.status(200).json({ message: 'Item claimed successfully', item })
})

// Route to update an item by ID
app.patch('/update-item/:id', async (req, res) => {
    const { id } = req.params
    const { itemName, description, locationFound, dateFound } = req.body

    // Validate if ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Item ID is required' }) // Return error if ID is missing
    }

    // Find the item by ID
    const item = await Item.findById(id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' }) // Return error if item is not found
    }

    // Update the item details
    item.itemName = itemName || item.itemName
    item.description = description || item.description
    item.locationFound = locationFound || item.locationFound
    item.dateFound = dateFound || item.dateFound

    // Save the updated item to the database
    await item.save()

    // Respond with success message and the updated item
    res.status(200).json({ message: 'Item updated successfully', item })
})

// Route to delete an item by ID
app.delete('/delete-item/:id', async (req, res) => {
    const { id } = req.params

    // Validate if ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Item ID is required' }) // Return error if ID is missing
    }

    // Find the item by ID
    const item = await Item.findById(id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' }) // Return error if item is not found
    }

    // Delete the item from the database
    await item.deleteOne()

    // Respond with success message
    res.status(200).json({ message: 'Item deleted successfully' })
})


