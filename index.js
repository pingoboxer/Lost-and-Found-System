const express = require('express')
const mongoose = require('mongoose')

const Item = require('./itemModel')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

const MONGODB_URI = 'mongodb+srv://terngukpamor:0SHjuPyX9rRw4GrR@cluster0.dwwhrnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the Lost and Found API System'})
})


app.post('/add-items', async (req, res) => {
    const { itemName, description, locationFound, dateFound } = req.body

    if (!itemName || !description || !locationFound || !dateFound) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const newItem = new Item({
        itemName,
        description,
        locationFound,
        dateFound,
    });

    await newItem.save()

    res.status(201).json({ message: 'Found item successfully added', item: newItem })
})

app.get('/unclaimed-items', async (req, res) => {
    const unclaimedItems = await Item.find({ claimed: false })

    if (unclaimedItems.length === 0) {
        return res.status(404).json({ message: 'No unclaimed items found' })
    }

    res.status(200).json({ items: unclaimedItems })
})

app.get('/find-item/:id', async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ message: 'Item ID is required' })
    }

    const item = await Item.findById(id)
    if (!item) {
        return res.status(404).json({ message: 'Item not found' })
    }
    res.status(200).json({ item })
})

app.put('/claim-item/:id', async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ message: 'Item ID is required' })
    }

    const item = await Item.findById(id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' })
    }
    if (item.claimed) {
        return res.status(400).json({ message: 'Item has already been claimed' })
    }
    item.claimed = true
    await item.save()
    res.status(200).json({ message: 'Item claimed successfully', item })
})

app.delete('/delete-item/:id', async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ message: 'Item ID is required' })
    }

    const item = await Item.findById(id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' })
    }
    await item.deleteOne()
    res.status(200).json({ message: 'Item deleted successfully' })
})


