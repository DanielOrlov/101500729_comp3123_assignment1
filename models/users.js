const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    
    "_id": "ObjectId",
    "username": {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username is already in use"],
        trim: true,
        maxlength: 30
    },
    "email": {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already in use"],
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
            "Please enter a valid email address"
        ]
    },
    "password": "String",      // must be hashed
    "created_at": "Date",
    "updated_at": "Date"
    
    // title: {
    //     type: String,
    //     required: [true, "Title is required" ],
    //     unique: true,
    //     trim: true,
    //     maxlength: 200
    // },
    // author: String,
    // price: {
    //     type: Number,
    //     required: [true, "Price is required"],
    //     min: [0, "Price cannot be negative"]
    // },
    // rating: {
    //     type: Number,
    //     default: 0,
    // }
})

module.exports = mongoose.model("User", userSchema)