const express = require('express')
require('./db/mongoose')

const productRouter = require('./routers/product')
const categoryRouter = require('./routers/category')

// Express App
const app = express()

app.use(express.json())

//Routes
app.use(categoryRouter)
app.use(productRouter)

module.exports = app