const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const Category = require('../src/models/category')
const Product = require('../src/models/product')

// Sample Category
const idd = new mongoose.Types.ObjectId()
const categoryOne = {
    _id: idd,
    categoryName: 'Sport'
}

// Sample Product
const productOne = {
    _id: new mongoose.Types.ObjectId(),
    productName: "Ball",
    qtyPerUnit: 5,
    unitPrice: 5.6,
    unitInStock: 10,
    discontinued: false,
    categoryId: idd
}

// Sample Product
const productTwo = {
    _id: new mongoose.Types.ObjectId(),
    productName: "BaseBall",
    qtyPerUnit: 5,
    unitPrice: 5.6,
    unitInStock: 10,
    discontinued: false,
    categoryId: idd
}

// Setting up database before each test
beforeEach(async () => {
    await Category.deleteMany()
    await new Category(categoryOne).save()
    await Product.deleteMany()
    await new Product(productOne).save()
    await new Product(productTwo).save()
})

test('Should create a new Product', async () => {
    // Creating Product and Response code assertion
    const response = await request(app).post('/product/create').send({
        productName: "FootBall",
        qtyPerUnit: 5,
        unitPrice: 5.6,
        unitInStock: 10,
        discontinued: false,
        categoryId: idd
    }).expect(201)

    // Assert that the database was changed correctly
    const product = await Product.findById(response.body._id)
    expect(product).not.toBeNull()


    // Assertions about the response
    expect(response.body).toMatchObject({
        productName: "football",
        qtyPerUnit: 5,
        unitPrice: 5.6,
        unitInStock: 10,
        discontinued: false,
        categoryId: idd
    })
})

test('Should retrieve all Products', async () => {
    // Retrieving Products and Response code assertion
    const response = await request(app).get('/product/readAll').send()
    .expect(200)

    // Assertions about the response
    expect(response.body.length).toBe(2)
})

test('Should retrieve a single Product', async () => {
    // Retrieving a Product and Response code assertion
    const response = await request(app).get('/product/read/'+productTwo._id.toString()).send()
    .expect(200)
    
    // Assertions about the response
    expect(response.body).toMatchObject({
        ...productTwo,
        productName: "baseball",
        categoryName: "sport"
    })
})

test('Should get Error on retrieve a single product if id is not valid/correct', async () => {
    // Incorrect Id Response code assertion
    await request(app).get('/product/read/6a76a76a76a76a76a76a76a7')
    .send()
    .expect(404)
    
    // Invalid Id Response code assertion
    await request(app).get('/product/read/6a7e147639a0')
    .send()
    .expect(400)

    // Invalid Id Response code assertion
    await request(app).get('/product/read/6a76')
    .send()
    .expect(400)
})

test('Should update a single Product', async () => {
    // Updating a Product and Response code assertion
    const response = await request(app).patch('/product/update/'+productOne._id.toString())
    .send({
        productName: "VolleyBall",
        qtyPerUnit: 10
    })
    .expect(200)
    
    // Assertions about the response
    expect(response.body).toMatchObject({
        ...productOne,
        productName: "volleyball",
        qtyPerUnit: 10
    })
})

test('Should get Error on updating a single product if id is not valid/correct', async () => {
    // Incorrect Id Response code assertion
    await request(app).patch('/product/update/6a76a76a76a76a76a76a76a7')
    .send()
    .expect(404)
    
    // Invalid Id Response code assertion
    await request(app).patch('/product/update/6a7e147639a0')
    .send()
    .expect(400)

    // Invalid Id Response code assertion
    await request(app).patch('/product/update/6a76')
    .send()
    .expect(400)
})

test('Should delete a single Product', async () => {
    // Deleting a Product and Response code assertion
    const response = await request(app).delete('/product/delete/'+productOne._id.toString())
    .send()
    .expect(200)
    
    // Assertions about the response
    expect(response.body).toMatchObject({
        ...productOne,
        productName: "ball"
    })
})

test('Should get Error on delete if id is not valid/correct', async () => {
    // Incorrect Id Response code assertion
    await request(app).delete('/product/delete/6a76a76a76a76a76a76a76a7')
    .send()
    .expect(404)

    // Incorrect Id Response code assertion
    await request(app).delete('/product/delete/6a7e147639a0')
    .send()
    .expect(400)

    // Invalid Id Response code assertion
    await request(app).delete('/product/delete/6a76')
    .send()
    .expect(400)
})