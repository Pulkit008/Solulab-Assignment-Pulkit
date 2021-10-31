const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const Category = require('../src/models/category')

// Sample Category
const categoryOne = {
    categoryName: 'Sport'
}

// Setting up database before each test
beforeEach(async () => {
    await Category.deleteMany()
    await new Category(categoryOne).save()
})

test('Should create a new Category', async () => {
    // Creating Category and Response code assertion
    const response = await request(app).post('/category/create').send({
        categoryName: 'AB'
    }).expect(201)

    // Assert that the database was changed correctly
    const category = await Category.findById(response.body._id)
    expect(category).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        categoryName: 'ab'
    })
})

test('Should create only unique Category', async () => {
    // Unique Category and Response code assertion
    await request(app).post('/category/create').send({
        categoryName: 'sport'
    }).expect(400)
})