const express = require('express')
const { createCategory } = require('../controllers/category.controller')
const router = new express.Router()

router.post('/category/create', createCategory)

module.exports = router