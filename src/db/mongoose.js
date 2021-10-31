const mongoose = require('mongoose')

// Database Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((e) => {
    console.log('ERROR ',e)
})