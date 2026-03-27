const mongoose = require('mongoose')

async function connectToDB(){
    try{
        const mongoUri = process.env.MONGO_URI || process.env['MONGO-URI']

        if (!mongoUri) {
            throw new Error('MongoDB URI is missing. Set MONGO_URI in your .env file.')
        }

        await mongoose.connect(mongoUri)

        console.log("Connected to database")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectToDB