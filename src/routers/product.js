const express = require('express')
const router = new express.Router()

const { createProduct,
    readAllProducts,
    readProduct,
    updateProduct,
    deleteProduct} = require('../controllers/product.controller')

router.post('/product/create', createProduct)

router.get('/product/readAll', readAllProducts)

router.get('/product/read/:id', readProduct)

router.patch('/product/update/:id', updateProduct)

router.delete('/product/delete/:id', deleteProduct)

module.exports = router