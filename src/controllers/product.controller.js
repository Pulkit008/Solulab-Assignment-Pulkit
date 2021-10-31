const Product = require('../models/product')
const ObjectId = require('mongoose').Types.ObjectId

function isValidObjectId(id){
      
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;        
        return false;
    }
    return false;
}

// for creating product
const createProduct = async (req, res) => {
    const product = new Product(req.body)
    try {
        await product.save()
        res.status(201).send(product)       // 201 created
    } catch (error) {
        res.status(400).send(error)         // 400 bad request
    }
}

// for retrieving all products
const readAllProducts = async (req, res) => {
    try {
        // Aggregate from two collection
        const products = await Product.aggregate([
            {
                $lookup: {                                  // join two collection
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'fromCategory'
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromCategory", 0] }, "$$ROOT"] } }
            },
            { $project: { fromCategory: 0 } }
        ])
        res.status(200).send(products)      // 200 OK
    } catch (error) {
        res.status(400).send(error)         // 400 bad request
    }
}

// for retrieving a product by ID
const readProduct = async (req, res) => {
    const pid = req.params.id
    // ID Validation
    if(!isValidObjectId(pid)){
        return res.status(400).send({error: 'Invalid Id'})
    }
    
    try {
        const products = await Product.aggregate([
            {
                $match: {
                    _id: ObjectId(pid)       // id matching
                }
            },
            {
                $lookup: {                                  // join two collection
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'fromCategory'
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromCategory", 0] }, "$$ROOT"] } }
            },
            { $project: { fromCategory: 0 } }
        ])
        if(products.length == 0){
            return res.status(404).send({error: 'Product Not Found!'})
        }
        res.status(200).send(products[0])   // 200 OK
    } catch (error) {
        res.status(400).send(error)         // 400 bad request
    }
}

// for updating a product by ID
const updateProduct = async (req, res) => {
    const pid = req.params.id
    // ID Validation
    if(!isValidObjectId(pid)){
        return res.status(400).send({error: 'Invalid Id'})
    }

    const updates = Object.keys(req.body)
    
    // valid fields for update
    const allowedUpdates = ['productName', 'qtyPerUnit', 'unitPrice', 'unitInStock', 'discontinued', 'categoryId']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    // checking for valid updates
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        const product = await Product.findById(pid)

        if (!product) {
            return res.status(404).send({error: 'Product Not Found!'})  // 404 not found
        }

        updates.forEach( update => product[update] = req.body[update])
        await product.save()
        res.status(200).send(product)       // 200 OK
    } catch (error) {
        res.status(400).send(error)         // 400 bad request
    }
}

// for deleting a product by ID
const deleteProduct = async (req, res) => {
    const pid = req.params.id
    // ID Validation
    if(!isValidObjectId(pid)){
        return res.status(400).send({error: 'Invalid Id'})
    }
    try {
        const product = await Product.findOneAndDelete({ _id: pid })

        if (!product) {
            return res.status(404).send({error: 'Product Not Found!'})      // 404 not found
        }
        res.status(200).send(product)       // 200 OK
    } catch (error) {
        res.status(500).send(error)         // 500 server error
    }
}

module.exports = {
    createProduct,
    readAllProducts,
    readProduct,
    updateProduct,
    deleteProduct
}