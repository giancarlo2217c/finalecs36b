const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tweetSchema = new Schema(
    {
        _id: String,
        time:String,
        name:String,
        description: String,
        text: String
    }
    )

module.exports = mongoose.model('tweets',tweetSchema)