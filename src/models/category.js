const mongoose = require('mongoose')

// Category Schema
const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    }
})
const Category = mongoose.model('Category', categorySchema)

module.exports = Category