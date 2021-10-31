const Category = require('../models/category')

// for creating Category
const createCategory = async (req, res) => {
    const category = new Category(req.body)
    try {
        await category.save()
        res.status(201).send(category)      // 201 created
    } catch (error) {
        res.status(400).send(error)         // 400 bad request
    }
}

module.exports = {
    createCategory
}