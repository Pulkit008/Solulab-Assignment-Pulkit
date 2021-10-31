const mongoose = require('mongoose')

// Product Schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    qtyPerUnit: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    unitInStock: {
        type: Number,
        required: true
    },
    discontinued: {
        type: Boolean,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
})
const Product = mongoose.model('Product', productSchema)

module.exports = Product